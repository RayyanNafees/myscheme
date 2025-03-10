import courses from "./data/courses.json" with { type: "json" };
import getInfoFromCard from "./student.ts";

const enroll = Deno.args[0];

const studentInfo = await getInfoFromCard(enroll.toUpperCase());

console.log(studentInfo.subjects.map((i) => ({
  code: i.code,
  name: i.subject,
  date: courses.find((j) => j.id === i.code)?.date,
  time: courses.find((j) => j.id === i.code)?.time,
  mode: i.mode,
})));
