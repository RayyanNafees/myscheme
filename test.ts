import courses from "./courses.json" with { type: "json" };
import getInfoFromCard from './student.ts'

const enroll = process.argv[2];

const studentInfo = await getInfoFromCard(enroll.toUpperCase())

console.log(studentInfo.subjects.map((i) => ({
  code: i.code,
  name: i.subject,
  date: courses.find((j) => j.id === i.code)?.date,
  time: courses.find((j) => j.id === i.code)?.time,
})));