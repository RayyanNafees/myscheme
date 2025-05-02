import { twi } from "tw-to-css";

export default () => (
  <footer
    style={twi`fixed bottom-0 left-0 w-full text-center bg-[#13171f] py-2`}
  >
    <small>
      Built with <span class="fire">&nbsp;</span> by
      <a
        href="https://rayyano.vercel.app"
        style={twi`text-[#017fc0] underline ml-1 italic`}
      >
        Diggaj
      </a>
    </small>
  </footer>
);
