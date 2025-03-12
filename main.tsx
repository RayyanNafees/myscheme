import { Hono } from "hono";
import courses from "./data/courses.json" with { type: "json" };
import getInfoFromCard from "./student.ts";
import { Scheme } from "./views/scheme.tsx";
import { NotFound } from "./views/404.tsx";
import Updates from "./views/updates.tsx";
import { serveStatic } from "hono/deno";
const app = new Hono();

app.get("/", async (c) => {
  const enroll = c.req.query("enroll") ?? "";

  const studentInfo = !enroll
    ? { subjects: [] }
    : await getInfoFromCard(enroll.toUpperCase());
  const modes = ["a", "b"];
  const myScheme = !enroll
    ? []
    : studentInfo.subjects
        .filter(
          (i) => courses.find((j) => j.id === i.code) && modes.includes(i.mode),
        )
        .map((i) => ({
          code: i.code,
          name: i.subject,
          date: courses.find((j) => j.id === i.code)?.date as string,
          time: courses.find((j) => j.id === i.code)?.time as string,
        }))
        .sort((a, b) => (new Date(a.date) > new Date(b.date) ? 1 : -1));

  return c.html(<Scheme enroll={enroll} myScheme={myScheme} />);
});

app.get("/updates", (c) => {
  return c.html(<Updates />);
});

app.use("/scheme.pdf", serveStatic({ path: "./public/scheme.pdf" }));

app.get("*", (c) => c.html(<NotFound />));

Deno.serve(app.fetch);
