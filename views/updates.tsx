import type { FC } from "hono/jsx";
import { Layout } from '../layouts/base.tsx'
import updates from '../data/updates.json' with { type: 'json' }

const Updates: FC = () => (
  <Layout title="Updates | ZHCET scheme generator}">
    <nav>
      <ul>
        <li>
          <h1>Updates</h1></li>
      </ul>
      <ul>
        <li>
          <a href="https://rayyano.vercel.app">
            About
          </a>
        </li>

        <li>
          {/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
          <a href="/" role="button">
            Generate Scheme
          </a>
        </li>
      </ul>
    </nav>

    {updates.updates.sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1)).map((i) => (
      <div key={i.version}>
        <hr />
        <hgroup>
          <h3>v{i.version}</h3>
          <h4>{new Date(i.date).toLocaleDateString()}</h4>
        </hgroup>
        <ul>
          {i.changes.map((j) => (
            <li key={j}>{j}</li>
          ))}
        </ul>
      </div>
    ))}
  </Layout>
)

export default Updates