import type { FC } from "hono/jsx";
import { Layout } from "../layouts/base.tsx";
import { twi } from "tw-to-css";
import { Menu } from "./menu.tsx";
import { Link } from "./link.tsx";

export const Scheme: FC<{
  enroll: string;
  myScheme: { code: string; name: string; date: string; time: string }[];
}> = ({ enroll, myScheme }) => (
  <Layout>
    <script defer src="https://unpkg.com/alpinejs" />
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
          <label class="overlay" for="drawer-left">&nbsp;</label>
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
    <form action="/" role="search"
      onload="localStorage.getItem('enroll') && window.location.href += '?enroll=' + localStorage.getItem('enroll')"
    >
      <input
        type="search"
        name="enroll"
        id="enroll"
        placeholder="e.g, GP4847"
        onchange="localStorage.setItem('enroll', this.value)"
        value={enroll}
      />
      <input type="submit" value="Search" />
    </form>

    <table
      style={{ display: !enroll ? "none" : "table" }}
      x-data="{ compact: false }"
    >
      <caption style={twi`text-2xl font-bold my-10`}>
        Scheme{" "}
        <small style={twi`text-xs font-semibold`} x-show="compact">
          (compact)
        </small>
      </caption>

      <thead>
        <tr>
          <td colspan={4}>
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
          {/* <th>Learn</th> */}
        </tr>
      </thead>
      <tbody>
        {myScheme?.map?.((i) => (
          <tr class="uncompact" key={i.code}>
            <td x-text={`!compact?'${i.code}':'${i.code}'.toLowerCase()`}>
              {i.code}
            </td>
            <td x-text={`!compact?'${i.name}':'${i.name}'.toLowerCase()`}>
              {i.name}
            </td>
            <td x-text={`!compact?'${i.date}':new Date('${i.date}').getDate()`}>
              {i.date}
            </td>
            <td x-text={`!compact?'${i.time}':'${i.time}'.split(' ')[0]`}>
              {i.time}
            </td>
            {/* <td x-text={`!compact?'${i.time}':'${i.time}'.split(' ')[0]`}>
              <a href={`/learn/${i.code}?name=${i.name}&date=${i.date}&time=${i.time}`} class="btn primary">Learn</a>
            </td> */}
          </tr>
        ))}
        {/* {myScheme?.map?.((i) => (
          <tr class="compact" key={i.code}>
            <td>
              {i.code.toLowerCase()}
            </td>
            <td>
              {i.name.toLowerCase()}
            </td>
            <td>
              {new Date(i.date).getDate()}
            </td>
            <td >
              {i.time.split(' ')[0]}
            </td>
            <td>
              <a href={`/learn/${i.code}?name=${i.name}&date=${i.date}&time=${i.time}`} class="btn primary">Learn</a>
            </td>
          </tr>
        ))} */}
      </tbody>
      <tfoot>
        <tr>
          <td colspan={4}>
            {enroll && (
              <form
                action={`https://ctengg.amu.ac.in/web/reg_record_${new Date().getMonth() > 6 ? "odd" : "even"}.php`}
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
    <footer
      style={twi`fixed bottom-0 left-0 w-full text-center bg-[#13171f] py-2`}
    >
      <small>
        Built with 🔥 by{" "}
        <a href="https://rayyano.vercel.app">
          <i>Diggaj</i>
        </a>
      </small>
    </footer>
  </Layout>
);
