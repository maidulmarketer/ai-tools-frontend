import Button from "@/components/buttons/Button";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { AiFillTag } from "react-icons/ai";
import { BiChevronRight, BiSolidChevronLeft } from "react-icons/bi";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { MdUpdate } from "react-icons/md";

export default function FilterByBadge({
  allCount,
  searchParams,
  trendingRange,
  setTrendingRange,
  trendingParams,
  pathName,
  categoryCount,
  timeRange,
  categorySlug,
}) {
  const router = useRouter();
  const ref = useRef(null);
  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset;
  };

  const activeClass = "font-bold text-odtheme";

  const filtersSetUrl = useCallback(
    (param) => {
      let filterParam =
        param === "trending"
          ? `trending=${trendingRange}`
          : param === "added-today"
          ? `time_range=today`
          : "";

      // Construct the final URL
      let url = pathName;
      if (param) {
        url += `?${filterParam}`;
      }

      router.replace(url);
    },
    [pathName, router, trendingRange]
  );

  useEffect(() => {
    if (trendingRange) {
      filtersSetUrl("trending");
    }
  }, [trendingRange, filtersSetUrl]);

  return (
    <div className="flex items-center w-full gap-3 lg:w-fit">
      <div className="flex items-center w-full gap-3 lg:w-fit">
        <BiSolidChevronLeft
          onClick={() => scroll(-30)}
          className="block w-6 lg:hidden"
        />
        <div
          className="flex w-full gap-3 overflow-x-auto scroll-container"
          ref={ref}
        >
          <Button
            onClick={() => router.replace(pathName)}
            variant="badgeType"
            className={`flex gap-1 ${searchParams.size ? "" : activeClass}`}
          >
            <HiMiniBars3CenterLeft className="w-5 h-5" /> All (
            {categoryCount ? categoryCount.total_tools : allCount?.total_tools})
          </Button>
          <Button
            onClick={() => filtersSetUrl("added-today")}
            variant="badgeType"
            className={`flex gap-1 ${timeRange ? activeClass : ""}`}
          >
            <MdUpdate className="w-5 h-5" /> Added Today (
            {categoryCount
              ? categoryCount.today_created_tools
              : allCount?.today_created_tools}
            )
          </Button>
          {/* <Button
            onClick={() => filtersSetUrl("deals")}
            variant="badgeType"
            className="flex gap-1"
          >
            <AiFillTag className="w-5 h-5" /> Deals (44)
          </Button> */}
          <Button
            onClick={() => {
              filtersSetUrl("trending");
              setTrendingRange("today");
            }}
            variant="badgeType"
            className={`flex gap-1 ${trendingParams ? activeClass : ""}`}
          >
            <HiOutlineTrendingUp className="w-5 h-5" /> Trending (
            {categoryCount
              ? categoryCount.trending_tools
              : allCount?.trending_tools}
            )
          </Button>
        </div>
        <BiChevronRight
          onClick={() => scroll(30)}
          className="block w-6 lg:hidden"
        />
      </div>
    </div>
  );
}
