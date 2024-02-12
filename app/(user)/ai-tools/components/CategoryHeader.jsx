"use client";
import Breadcrumb from "@/components/breadcrumbs/Breadcrumb";
import { getCounts } from "@/services/user/toolsService";
import { useQuery } from "@tanstack/react-query";
import { BiSolidDashboard } from "react-icons/bi";

export default function CategoryHeader() {
  const { data: allCount, refetch } = useQuery({
    queryKey: ["tools-filters-count"],
    queryFn: () => getCounts().then((res) => res.data),
  });

  return (
    <div className="border-b border-odtheme/10 pb-7">
      <div className="pt-10 pl-4">
        <Breadcrumb />
      </div>
      <div className="pt-14 px-4">
        <div className="flex justify-start items-center gap-1 font-semibold pb-7">
          <BiSolidDashboard className="w-8 h-8 text-primary-400" />
          <p className="text-4xl">Category</p>
        </div>

        <div className="max-w-3xl pb-12">
          <p className="text-lg">
            Lorem ipsum dolor sit amet. Et nihil amet quo sapiente excepturi qui
            distinctio doloremque non nemo fugiat? Ea velit iste est velit quod
            ea voluptatem quia a quia quia sed
          </p>
        </div>

        <div>
          <p>40 Categories, {allCount?.total_tools} AI Tools</p>
        </div>
      </div>
    </div>
  );
}
