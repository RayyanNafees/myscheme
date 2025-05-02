import { Layout } from "../layouts/base.tsx";
import type { FC } from "hono/jsx";
import Footer from "./footer.tsx";
import type { AttendanceType } from "../utils/parse-attendance.tsx";

// const { name, faculty, attendance } = await parseAttendance(facultyNo);

type AttendanceProps = {
  name: string;
  faculty: string;
  attendance: AttendanceType[];
};

export const Attendance: FC<AttendanceProps> = (props) => (
  <Layout title="ZHCET Attendance">
    <hgroup>
      <h1>ZHCET Attendance</h1>
      <h2>Also tells the attendance of next attended/missed classes</h2>
    </hgroup>
    <p>{props.name}</p>
    <small>{props.faculty}</small>
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Total</th>
          <th>Attended</th>
          <th>Percentage</th>
          <th>Next attend</th>
          <th>Next miss</th>
          <th>Updated at</th>
        </tr>
      </thead>
      <tbody>
        {props.attendance.map((a) => (
          <tr key={a.code}>
            <td>{a.code}</td>
            <td>{a.total}</td>
            <td>{a.attended}</td>
            <td>{a.percentage}</td>
            <td>{a.updated_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <Footer />
  </Layout>
);
