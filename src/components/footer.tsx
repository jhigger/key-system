import { FaDiscord } from "react-icons/fa";
import { Button } from "./ui/button";

const Footer = () => {
  return (
    <footer className="relative z-10">
      <div className="container mx-auto flex flex-col flex-wrap items-center justify-between gap-2 p-5 md:flex-row">
        <p className="mb-4 text-sm md:mb-0">
          Made with ❤️ by{" "}
          <a
            href="https://discord.com/users/284489990598295552"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            Kairos
          </a>
        </p>
        <div className="flex gap-2">
          <Button size={"icon"} className="p-2" asChild>
            <a
              href="https://discord.gg/ctx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord className="size-full" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
