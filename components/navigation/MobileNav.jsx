"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { WiMoonAltFirstQuarter } from "react-icons/wi";
import { BsSun } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";

import { cn } from "@/lib/utils";
import { navLinks, socialLinks } from "@/constants/navigation";

import Container from "../wrappers/Container";
import Button from "../buttons/Button";

export default function MobileNav() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  function toggleMobileNav() {
    setIsMobileNavOpen(!isMobileNavOpen);
  }

  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
    toggleMobileNav();
  }

  // Disable vertical scrolling while mobile nav is open
  useEffect(() => {
    const body = document.getElementsByTagName("body")[0];

    function handleResize() {
      // Close mobile menu if window width >= 768px
      if (innerWidth >= 768) {
        setIsMobileNavOpen(false);
      }
    }

    if (isMobileNavOpen) {
      addEventListener("resize", handleResize);
      body.style.height = "100vh";
      body.style.overflowY = "hidden";
    } else {
      body.style.height = "auto";
      body.style.overflowY = "visible";
    }

    return () => removeEventListener("resize", handleResize);
  }, [isMobileNavOpen]);

  return (
    <div>
      <div className="cursor-pointer" onClick={toggleMobileNav}>
        {isMobileNavOpen ? (
          <RxCross1 className="w-6 h-6" />
        ) : (
          <HiOutlineMenuAlt1 className="w-6 h-6 rotate-180" />
        )}
      </div>

      <div
        className={cn(
          "fixed bg-dtheme transition-all",
          isMobileNavOpen
            ? "inset-0 top-20 opacity-100"
            : "top-0 right-0 left-full bottom-full overflow-hidden opacity-0"
        )}
      >
        <Container className="py-0">
          <ul className="text-center divide-y-2 divide-odtheme/10">
            {navLinks.map((link) => (
              <li key={link.href} className="py-6" onClick={toggleMobileNav}>
                <Link href={link.href} className="text-xl">
                  {link.title}
                </Link>
              </li>
            ))}
            <li className="py-6 flex gap-3 justify-center">
              {socialLinks.map((link) => (
                <Image
                  alt={link.title}
                  key={link.title}
                  src={link.logo}
                  width={30}
                  height={30}
                  className="w-7"
                  onClick={toggleMobileNav}
                />
              ))}
            </li>
          </ul>

          <Button
            variant="dynamic"
            onClick={toggleTheme}
            className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-4"
          >
            {theme === "light" ? (
              <WiMoonAltFirstQuarter className="w-5 h-5" />
            ) : (
              <BsSun className="w-5 h-5" />
            )}
            <span className="text-xl">
              {theme === "light" ? "Dark mode" : "Light mode"}
            </span>
          </Button>
        </Container>
      </div>
    </div>
  );
}
