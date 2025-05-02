/* @jsxImportSource npm:hono/jsx */
import * as cheerio from "npm:cheerio";
import { Hono } from "hono";
import { Attendance } from "../views/attendance.tsx";

const app = new Hono();

export type AttendanceType = {
  code: string;
  total: number;
  attended: number;
  percentage: number;
  isShort: boolean;
  updated_at: string;
  next_attend: number;
  next_miss: number;
};

export default app;

export const parseAttendance = async (facultyNo: string) => {
  const getAttendedChange = (
    attended: number,
    total: number,
    current: number,
  ) => +(((attended + 1) / (total + 1) * 100) - current).toFixed(2);

  const getMissedChange = (
    attended: number,
    total: number,
    current: number,
  ) => +((attended / (total + 1) * 100) - current).toFixed(2);

  const html = await fetch(
    `https://ctengg.amu.ac.in/web/table.php?id=${facultyNo}`,
  ).then((r) => r.text());

  const $ = cheerio.load(html);

  const [name, faculty] =
    ($("body > div.table-responsive > strong").html() || "<br>").split("<br>");

  const attendance: AttendanceType[] = [];

  $("table > tbody > tr").not("tr:first").map((_, el) => {
    const [code, total, attended, percentage, remark, updated_at] =
      $(el).html()?.replace(/\n<td>(.+)<\/td>\n/, "$1").split("</td><td>") ||
      [];

    attendance.push({
      code,
      total: +total,
      attended: +attended,
      percentage: +percentage,
      next_attend: getAttendedChange(+attended, +total, +percentage),
      next_miss: getMissedChange(+attended, +total, +percentage),
      isShort: remark === "SHORT",
      updated_at,
    });
  });

  return { name, faculty, attendance };
};

app.get("/", async (c) => {
  const facultyNo = c.req.query("faculty") ??
    "23aebea229";
  const attendance = await parseAttendance(facultyNo);

  return c.html(
    <Attendance {...attendance} />,
  );
});
