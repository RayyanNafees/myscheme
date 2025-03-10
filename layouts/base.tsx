import type { FC } from "hono/jsx";

export const Layout: FC = (props) => (
  <html lang="en">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://unpkg.com/@picocss/pico" />
      <script src="https://unpkg.com/@unocss/runtime" />
      <meta name="keywords" content="ZHCET, Exam Scheme, ZHCET Exam Scheme" />
      <meta name="description" content="My ZHCET Exam Scheme" />

      <meta property="og:title" content="My ZHCET Exam Scheme" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://scheme.deno.dev/" />
      <meta
        property="og:description"
        content="My ZHCET Exam Scheme"
      />
      <meta property="og:image" content="https://scheme.deno.dev/og.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="My ZHCET Exam Scheme" />
      <meta name="twitter:description" content="My ZHCET Exam Scheme" />
      <meta
        name="twitter:image"
        content="https://scheme.deno.dev/og.png"
      />
      <title>{props.title ?? 'ZHCET Scheme Generator'}</title>
    </head>
    <body>
      <main class="container">
        {props.children}
      </main>
    </body>
  </html>
);
