import type { FC } from "hono/jsx";
import { Layout } from '../layouts/base.tsx'
export const Scheme: FC<{
  enroll: string;
  myScheme: { code: string; name: string; date: string; time: string }[];
}> = ({
  enroll, myScheme
}) => (
    <Layout>
      <nav>
        <ul>
          <li>
            <hgroup>
              <h1>My Scheme</h1>
              <h2>ZHCET Exam Scheme</h2>
            </hgroup>
          </li>
        </ul>
        <ul>
          <li>
            <a href="/updates" class="secondary">
              Updates
            </a>
          </li>
          <li>

            <a href="https://forms.gle/32u5JZ9Jmv1FD43v7">
              Report Issue
            </a>
          </li>
        </ul>
      </nav>

      <form
        action="/"
        onload="localStorage.getItem('enroll') && window.location.href += '?enroll=' + localStorage.getItem('enroll')"
      >
        <label for="enroll">Enter your enrollment number</label>
        {/* biome-ignore lint/a11y/noRedundantRoles: <explanation> */}
        {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
        <fieldset role="group">
          <input
            type="search"
            name="enroll"
            id="enroll"
            placeholder="e.g, GP4847"
            onchange="localStorage.setItem('enroll', this.value)"
            value={enroll}
          />
          <button type="submit" // onclick="window.location.href += ('?enroll=' + document.querySelector('input').value) "
          >
            Search
          </button>
        </fieldset>
      </form>

      <table style={{ display: !enroll ? "none" : "table" }}>
        <caption class="text-2xl font-bold my-10">Scheme</caption>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {myScheme?.map?.((i) => (
            <tr key={i.code}>
              <td>{i.code}</td>
              <td>{i.name}</td>
              <td>{i.date}</td>
              <td>{i.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <footer class="fixed bottom-0 w-full text-center bg-[#13171f] py-2">
        <small>
          Built with 🔥 by{" "}
          <a href="https://rayyano.vercel.app">
            <i>Diggaj</i>
          </a>
        </small>
      </footer>
      {enroll && (
        <form
          action="https://ctengg.amu.ac.in/web/reg_record.php"
          method="post"
          target="_blank"
        >
          <input type="hidden" name="fac" value={enroll} />
          <input
            type="hidden"
            name="sem"
            value={new Date().getMonth() > 6 ? "odd" : "even"}
          />
          <input type="hidden" name="submit" value="Download" />
          <button type="submit" class="mb-10">
            Download Registeration Card
          </button>
        </form>
      )}
    </Layout>)