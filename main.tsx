import { Hono } from "hono";
import courses from "./data/courses.json" with { type: "json" };
import getInfoFromCard from "./utils/student.ts";
import { Scheme } from "./views/scheme.tsx";
import { NotFound } from "./views/404.tsx";
import Updates from "./views/updates.tsx";
import { serveStatic } from "hono/deno";
import { setCookie, getCookie } from "hono/cookie";

const app = new Hono();

app.get("/", async (c) => {
  console.time("getInfoFromCard");
  const hasCookie = getCookie(c, "enroll");
  const enroll = c.req.query("enroll") ?? hasCookie ?? "";

  if (!enroll) return c.html(<Scheme enroll={enroll} myScheme={[]} />);

  if (!hasCookie) setCookie(c, "enroll", enroll, { maxAge: 60 * 60 * 24 * 30 });

  const studentInfo = await getInfoFromCard(enroll.toUpperCase());

  const subjectIds = studentInfo.subjects.map((i) => i.code);

  const scheme = courses
    .filter((c) => subjectIds.includes(c.id))
    .toSorted((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));
  console.timeEnd("getInfoFromCard");
  console.time("rendering");
  const resp = c.html(<Scheme enroll={enroll} myScheme={scheme} />);
  console.timeEnd("rendering");
  return resp;
});

app.get("/updates", (c) => {
  return c.html(<Updates />);
});

app.use("/scheme.pdf", serveStatic({ path: "./public/scheme.pdf" }));
app.use("/compact.css", serveStatic({ path: "./public/compact.css" }));

app.get("*", (c) => c.html(<NotFound />));

Deno.serve(app.fetch);
