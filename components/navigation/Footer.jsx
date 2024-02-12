import Link from "next/link";
import Image from "next/image";
import Brand from "./Brand";
import Container from "../wrappers/Container";
import { footerLinks, socialLinks } from "@/constants/navigation";

export default function Footer() {
  return (
    <footer>
      <Container className={`relative flex justify-between py-4 items-center border-t-2 border-odtheme/10`}>
        <Brand sponsor="Stocking AI" />
        <div className="hidden lg:flex gap-6 text-sm font-semibold">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex gap-3 text-sm">
          {socialLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Image alt={link.title} className="w-6 h-6" src={link.logo} />
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
