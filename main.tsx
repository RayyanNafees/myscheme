import { Hono } from "hono";
import courses from "./data/courses.json" with { type: "json" };
import getInfoFromCard from "./utils/student.ts";
import { Scheme } from "./views/scheme.tsx";
import { NotFound } from "./views/404.tsx";
import Updates from "./views/updates.tsx";
import { serveStatic } from "hono/deno";
import { getCookie, setCookie } from "hono/cookie";
import { pdfText } from "jsr:@pdf/pdftext";
const app = new Hono();
const kv = await Deno.openKv();
app.get("/", async (c) => {
  const hasCookie = getCookie(c, "enroll");
  const enroll = c.req.query("enroll") ?? hasCookie ?? "";

  if (!enroll) return c.html(<Scheme enroll={enroll} myScheme={[]} />);

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
    const studentInfo = await getInfoFromCard(enroll.toUpperCase());

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

  // let text = getCookie(c, `${enroll}-schemeHTML`);
  let text = (await kv.get<string>(['schemeHTML', enroll])).value as string;

  console.timeEnd("getInfoFromCard");
  console.time("rendering");

  if (!text) {
    console.log("rendering.....");
    const resp = c.html(<Scheme enroll={enroll} myScheme={scheme} />);
    text = await (await resp).text();
    // setCookie(c, 'schemeHTML', enroll, text, { maxAge: 60 * 60 * 24 * 30 });
    await kv.set(['schemeHTML', enroll], text);
  }

  console.timeEnd("rendering");
  return new Response(text, {headers: {"Content-Type": "text/html"}});
});

app.get("/updates", (c) => {
  return c.html(<Updates />);
});
app.post("/api/file", async (c) => {
  const file = await c.req.arrayBuffer();
  const data = await pdfText(file);
  return c.text(data as string);
});
app.get("/api/student/:enroll", async (c) => {
  const enroll = c.req.param("enroll");
  const studentInfo = await getInfoFromCard(enroll.toUpperCase());
  return c.json(studentInfo);
});

app.use("/compact.css", serveStatic({ path: "./public/compact.css" }));

app.get("*", (c) => c.html(<NotFound />));

Deno.serve(app.fetch);
