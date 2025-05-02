import { type Context, Hono } from "hono";
import courses from "./data/courses.json" with { type: "json" };
import updatesJSON from "./data/updates.json" with { type: "json" };
import getInfoFromCard, { type StudentInfo } from "./utils/student.ts";
import { Scheme } from "./views/scheme.tsx";
import { NotFound } from "./views/404.tsx";
import Updates from "./views/updates.tsx";
import { serveStatic } from "hono/deno";
import { getCookie, setCookie } from "hono/cookie";
import { pdfText } from "@pdf/pdftext";
import SparkMD5 from "spark-md5";
import { cookieCache } from "./utils/cache.ts";
import {
  type AttendanceInfo,
  parseAttendance,
} from "./utils/parse-attendance.tsx";

const app = new Hono();
const kv = await Deno.openKv();

const mapAttendance = (attendance: AttendanceInfo) =>
  Object.fromEntries(attendance.attendance.map((a) => [a.code, a.percentage]));

const getCachedStudentInfo = async (c: Context, enroll: string) =>
  JSON.parse(
    await cookieCache(
      c,
      "studentInfo",
      async () => JSON.stringify(await getInfoFromCard(enroll)),
    ),
  ) as StudentInfo;

app.get("/attendance", async (c: Context) => {
  const attendance = getCookie(c, "attendance");
  const code = c.req.query("code");

  if (!attendance) {
    let facultyNo = c.req.param("faculty") ??
      getCookie(c, "facultyNo") as string;

    if (!facultyNo) {
      const enroll = c.req.param("faculty") ??
        getCookie(c, "facultyNo") as string;
      const studentInfo = await getCachedStudentInfo(c, enroll);

      setCookie(c, "facultyNo", facultyNo, { maxAge: 60 * 60 * 24 * 30 });
      facultyNo = studentInfo.faculty as string;
    }
    const attendance = await parseAttendance(facultyNo);
    const attendanceMap = mapAttendance(attendance);
    setCookie(c, "attendance", JSON.stringify(attendanceMap), {
      maxAge: 60 * 60 * 24 * 30,
    });
    return c.json(code ? attendanceMap[code] : attendanceMap);
  }
  const parsedAttendance = JSON.parse(attendance);
  return c.json(code ? parsedAttendance[code] : parsedAttendance);
});

app.get("/", async (c: Context) => {
  const hasCookie = getCookie(c, "enroll");
  const enroll = c.req.query("enroll") ?? hasCookie ?? "";

  if (!enroll) {
    return c.html(<Scheme enroll={enroll} myScheme={[]} attendance={{}} />);
  }

  if (!hasCookie) setCookie(c, "enroll", enroll, { maxAge: 60 * 60 * 24 * 30 });
  let scheme: {
    // id: string;
    course: string;
    date: string;
    time: string;
    course_name: string;
  }[];

  console.time("getInfoFromCard");
  const storedScheme = getCookie(c, `${enroll}-scheme`);
  if (!storedScheme) {
    console.log("FETCHING REGISTERATION CARD");
    const studentInfo = await getCachedStudentInfo(c, enroll);

    const subjectIds = studentInfo.subjects.map((i) => i.code);

    scheme = courses
      .filter((c) => subjectIds.includes(c.course))
      .toSorted((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));

    setCookie(c, `${enroll}-scheme`, JSON.stringify(scheme), {
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    scheme = JSON.parse(storedScheme);
  }

  const attendance = JSON.parse(
    await cookieCache(c, `attendance-${enroll}`, async () => {
      const info = await getCachedStudentInfo(c, enroll);
      if (!info?.faculty) return "{}";
      const attend = await parseAttendance(info.faculty);
      const attendanceMap = mapAttendance(attend);
      return JSON.stringify(attendanceMap);
    }),
  );

  // let text = getCookie(c, `${enroll}-schemeHTML`);
  let text = (await kv.get<string>(["schemeHTML", enroll])).value as string;

  console.timeEnd("getInfoFromCard");
  console.time("rendering");
  console.log("Updates JSON hash", updatesJSON?.code_hash ?? updatesJSON);
  if (
    !text ||
    ((updatesJSON?.code_hash as string) !==
      SparkMD5.hash(text ?? ""))
  ) {
    console.log("rendering.....");
    const resp = c.html(
      <Scheme enroll={enroll} myScheme={scheme} attendance={attendance} />,
    );
    text = await (await resp).text();
    // setCookie(c, 'schemeHTML', enroll, text, { maxAge: 60 * 60 * 24 * 30 });
    await kv.set(["schemeHTML", enroll], text);
  }

  console.timeEnd("rendering");
  console.log("CODE HASH: ", SparkMD5.hash(text ?? ""));
  return new Response(text, { headers: { "Content-Type": "text/html" } });
});

app.get("/updates", (c: Context) => {
  return c.html(<Updates />);
});
app.post("/api/file", async (c: Context) => {
  const file = await c.req.arrayBuffer();
  const data = await pdfText(file);
  return c.text(data as string);
});
app.get("/api/student/:enroll", async (c: Context) => {
  const enroll = c.req.param("enroll");
  const studentInfo = await getInfoFromCard(enroll.toUpperCase());
  return c.json(studentInfo);
});

app.use("/compact.css", serveStatic({ path: "./public/compact.css" }));

app.get("*", (c: Context) => c.html(<NotFound />));

Deno.serve(app.fetch);
