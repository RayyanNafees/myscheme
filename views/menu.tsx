import type { FC } from "hono/jsx";
import { twi } from "tw-to-css";
import { Link } from "./link.tsx";

export const Menu: FC = () => (
  <section>
    <span style={twi`text-xs font-semibold`}>Scheme</span>
    <span style={twi`grid grid-cols-1 gap-2 ml-4 mt-3`}>
      <Link href="/updates">Updates</Link>
      <Link href="https://zhcet-scheme.surge.sh" external>
        Scheme Search
      </Link>
      <Link href="/scheme.pdf" external>
        Scheme PDF (official)
      </Link>
      {/*<Link href="/seats">Seating Plan</Link>*/}
    </span>
    <hr />

    <span style={twi`text-xs font-semibold`}>Other Apps</span>
    <span style={twi`grid grid-cols-1 gap-2 ml-4 mt-3`}>
      <Link href="https://study.myamu.site" external>
        AMULET
      </Link>
      <Link href="https://zhcet.surge.sh" external>
        Student Search
      </Link>
      <Link href="https://zhcet-result.surge.sh" external>
        B.Tech Results
      </Link>
    </span>
    <hr />

    <span style={twi`text-xs font-semibold`}>About Author</span>
    <span style={twi`grid grid-cols-1 gap-2 ml-4 mt-3`}>
      <Link href="https://ryancv.tiiny.site" external>
        Resume
      </Link>
      <Link href="https://rayyano.vercel.app" external>
        Website
      </Link>
      <Link href="https://github.com/RayyanNafees" external>
        Github
      </Link>
      <Link href="https://linkedin.com/in/rayyan-nafees" external>
        LinkedIn
      </Link>
      <Link href="https://wa.me/+919193497273" external>
        WhatsApp
      </Link>
    </span>
  </section>
);
