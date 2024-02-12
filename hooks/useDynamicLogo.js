"use client";
import { useTheme } from "next-themes";
import logo from "@/public/logo.svg";
import logoDark from "@/public/logo-dark.svg";

export default function useDynamicLogo() {
  const { theme } = useTheme();
  if (!theme) return logo;
  return theme === "light" ? logo : logoDark;
}
