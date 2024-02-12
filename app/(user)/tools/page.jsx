"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Tools = () => {
  const route = useRouter();

  useEffect(() => {
    route.push("/");
  }, []);

  return (
    <div></div>
  );
}

export default Tools;