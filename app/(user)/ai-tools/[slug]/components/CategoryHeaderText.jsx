"use client";
import Breadcrumb from "@/components/breadcrumbs/Breadcrumb";
import { getCategoryToolText } from "@/services/user/toolsService";
import { useQuery } from "@tanstack/react-query";

export default function CategoryHeaderText({ slug }) {
  const {
    isLoading,
    isError,
    data: tools,
  } = useQuery({
    queryKey: [`category/${slug}/tools/text`],
    queryFn: () =>
    getCategoryToolText(slug).then((res) => res.data),
  });

  return (
    <div className="pt-14 pb-8 flex flex-col gap-9">
      <Breadcrumb/>
      <h1 className="text-4xl font-bold">
      Best AI {tools.title} Tools
      </h1>
      <div
        className="override-style"
        dangerouslySetInnerHTML={{ __html: tools.description }}
      />
    </div>
  );
}
