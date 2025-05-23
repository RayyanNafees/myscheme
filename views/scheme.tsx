import type { FC } from "hono/jsx";
import { Layout } from "../layouts/base.tsx";
import { twi } from "tw-to-css";
import { Menu } from "./menu.tsx";
import { Link } from "./link.tsx";
import Footer from "./footer.tsx";

// import { memo } from "hono/jsx";
export const Scheme: FC<{
  enroll: string;
  attendance: Record<string, string>;
  myScheme: {
    course: string;
    course_name: string;
    date: string;
    time: string;
  }[];
}> = ({ enroll, myScheme, attendance: att }) => (
  <Layout>
    <link rel="stylesheet" href="/compact.css" />

    <nav>
      <ul>
        <li>
          <input type="checkbox" id="drawer-left" class="drawer-toggle" />

          <label for="drawer-left">
            <img
              src="https://api.iconify.design/mdi/menu.svg?color=%235b6272"
              style={twi`w-7`}
              alt="menu"
            />
          </label>
          <label class="overlay" for="drawer-left">
            &nbsp;
          </label>
          <div class="drawer">
            <div class="drawer-content pt-10 flex flex-col h-full">
              <label
                for="drawer-left"
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              >
                ✕
              </label>
              <div>
                <h2 class="text-xl font-medium">Links</h2>
              </div>
              <div>
                <Menu />
              </div>
            </div>
          </div>
        </li>
        <li>
          <h3>ZHCET Scheme</h3>
        </li>
      </ul>
      <ul>
        <li>
          <Link href="https://forms.gle/32u5JZ9Jmv1FD43v7" blue underline>
            Report Issue
          </Link>
        </li>
      </ul>
    </nav>
    <label for="enroll">Enter your enrollment number</label>

    {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
    <form action="/" role="search">
      <input
        type="search"
        name="enroll"
        id="enroll"
        placeholder="e.g, GP4847"
        value={enroll}
        pattern="[A-z]{2}\d{4}"
      />
      <input type="submit" value="Search" />
    </form>

    <table style={{ display: !enroll ? "none" : "table" }}>
      <caption style={twi`text-2xl font-bold my-10`}>
        Scheme <small style={twi`text-xs font-semibold`}>(compact)</small>
      </caption>

      <thead>
        <tr>
          <td colspan={5}>
            <legend>
              Compact:{" "}
              <input
                type="checkbox"
                // biome-ignore lint/a11y/useAriaPropsForRole: <explanation>
                role="switch"
                name="compact"
                x-model="compact"
              />
            </legend>
          </td>
        </tr>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Attend %</th>
        </tr>
      </thead>

      <tbody class="uncompact">
        {myScheme?.map?.((i) => (
          <tr
            key={i.course}
            style={+att[i.course] > 65
              ? twi`text-blue-100 `
              : twi`text-red-100 `}
          >
            <td data-short={+att[i.course] < 65}>{i.course}</td>
            <td data-short={+att[i.course] < 65}>{i.course_name}</td>
            <td data-short={+att[i.course] < 65}>{i.date}</td>
            <td data-short={+att[i.course] < 65}>{i.time}</td>
            <td data-short={+att[i.course] < 65}>{att[i.course]}</td>
            {
              /* <td
              hx-get={`/attendance?enroll=${enroll}&code=${i.course}`}
            >
              <div class="htmx-indicator">
                <img
                  src="https://api.iconify.design/mdi/loading.svg?color=%235b6272"
                  alt="loading"
                  height="30"
                  width="30"
                  style={twi`w-5 h-5 animate-spin`}
                />
              </div>
            </td> */
            }
          </tr>
        ))}
      </tbody>
      <tbody class="compact">
        {myScheme?.map?.((i) => (
          <tr
            key={i.course}
          >
            <td data-short={+att[i.course] < 65}>{i.course.toLowerCase()}</td>
            <td data-short={+att[i.course] < 65}>
              {i.course_name.toLowerCase()}
            </td>
            <td data-short={+att[i.course] < 65}>
              {new Date(i.date).getDate()}
            </td>
            <td data-short={+att[i.course] < 65}>
              {i.time.split("-")[0].replace(/Noon|AM|PM/, "")}
            </td>
            <td data-short={+att[i.course] < 65}>{att[i.course]}</td>
            {
              /* <td
              hx-get={`/attendance?enroll=${enroll}&code=${i.course}`}
            >
              <div class="htmx-indicator">
                <img
                  src="https://api.iconify.design/mdi/loading.svg?color=%235b6272"
                  alt="loading"
                  height="30"
                  width="30"
                  style={twi`w-5 h-5 animate-spin`}
                />
              </div>
            </td> */
            }
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colspan={5}>
            {enroll && (
              <form
                action={`https://ctengg.amu.ac.in/web/reg_record_${
                  new Date().getMonth() > 6 ? "odd" : "even"
                }.php`}
                method="post"
                target="_blank"
              >
                <input type="hidden" name="fac" value={enroll} />
                <input type="hidden" name="submit" value="Download" />
                <button type="submit">Download Registeration Card</button>
              </form>
            )}
          </td>
        </tr>
      </tfoot>
    </table>
    <br />
    <br />
    <Footer />
  </Layout>
);
