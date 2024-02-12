"use client";

import { getCategories } from "@/services/admin/categoryService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import categoryImage from "@/public/images/category.png"

export default function AllCategory() {
  const {
    isLoading,
    data: category,
    isError,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories().then((res) => res.data),
  });

  if (isLoading) return "Loading.....";

  return (
    <>
      {category.results.map((item, i) => (
        <div className="flex flex-col gap-6" key={i}>
          <div className="flex gap-1 font-bold text-xl" key={i}>
            <Image
            className="w-7"
            width={5}
            height={5}
            src={item.image || categoryImage} 
            alt="icon"
            />
            <p> {item.title}</p>
          </div>
          {item.subcategory.map((item) => (
            <Link
              href={`ai-tools/${item.slug}`}
              className="flex flex-col gap-6"
              key={item.title}
            >
              {item.title} ({item.total_tools})
            </Link>
          ))}
        </div>
      ))}
    </>
  );
}
