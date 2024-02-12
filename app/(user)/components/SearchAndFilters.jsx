"use client";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { RxCross2, RxDashboard } from "react-icons/rx";
import { PiSlidersHorizontalBold } from "react-icons/pi";

import { cn } from "@/lib/utils";
import { getCategoryCounts, getCounts } from "@/services/user/toolsService";
import AlgoliaSearch from "./searchandfilters/AlgoliaSearch";
import Badge from "@/components/badges/Badge";
import Button from "@/components/buttons/Button";
import CategoryModal from "./searchandfilters/CategoryModal";
import FilterModal from "./searchandfilters/FilterModal";
import Modal from "@/components/modal/Modal";
import SortedBy from "./searchandfilters/SortedBy";
import FilterByBadge from "./searchandfilters/FilterByBadge";
import FullScreenModal from "@/components/modal/FullScreenModal";

export default function SearchAndFilter({ categorySlug }) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [trendingRange, setTrendingRange] = useState("");

  const categoriesParams = searchParams.get("categories");
  const search = searchParams.get("search");
  const featuresParams = searchParams.get("features");
  const pricesParams = searchParams.get("pricing");
  const trendingParams = searchParams.get("trending");
  const timeRange = searchParams.get("time_range");

  const [searchValue, setSearchValue] = useState(search);
  const [checkedCategory, setCategory] = useState([]);
  const [checkedFeatures, setFeatures] = useState([]);
  const [checkedPrices, setPrices] = useState([]);

  function resetFiltersByNameAndOptions(name, valueToRemove, resetState) {
    const currentParams = new URLSearchParams(searchParams);
    const currentQuery = currentParams.get(name);

    if (currentQuery) {
      const categoriesArray = currentQuery.split(",");
      const updatedCategories = categoriesArray.filter(
        (category) => category !== valueToRemove
      );

      if (updatedCategories.length > 0) {
        currentParams.set(name, updatedCategories.join(","));
        resetState(updatedCategories);
      } else {
        currentParams.delete(name);
      }

      // Replace %2C with ,
      const updatedUrl =
        pathName + "?" + currentParams.toString().replace(/%2C/g, ",");

      replace(updatedUrl);
    }
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const {
    isLoading,
    isError,
    data: allCount,
    refetch,
  } = useQuery({
    queryKey: ["tools-filters-count"],
    queryFn: () => getCounts().then((res) => res.data),
  });

  const { data: categoryCount } = useQuery({
    queryKey: [`${categorySlug}/tools-filters-count`],
    enabled: !!categorySlug,
    queryFn: () => getCategoryCounts(categorySlug).then((res) => res.data),
  });

  return (
    <div className="flex flex-col justify-center gap-6">
      <div className="flex gap-2 pt-12">
        <AlgoliaSearch
          checkedCategory={checkedCategory}
          checkedFeatures={checkedFeatures}
          checkedPrices={checkedPrices}
          searchCount={allCount}
          refetch={refetch}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        {pathName === "/" ? (
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="secondaryOutlined"
            className="hidden gap-1 sm:flex"
          >
            <RxDashboard className="w-5 h-5" /> Categories
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col-reverse flex-wrap-reverse items-center justify-between gap-3 pb-6 border-b lg:flex-row border-odtheme/10">
        <FilterByBadge
          allCount={allCount}
          searchParams={searchParams}
          trendingRange={trendingRange}
          setTrendingRange={setTrendingRange}
          trendingParams={trendingParams}
          pathName={pathName}
          categorySlug={categorySlug}
          categoryCount={categoryCount}
          timeRange={timeRange}
        />

        {/* filter & sort */}
        <div className="hidden gap-3 divide-x-2 divide-odtheme/10 lg:flex">
          <p
            className="flex items-center gap-2 font-bold cursor-pointer"
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filters
            <PiSlidersHorizontalBold className="w-5" />
          </p>
          <div className="flex items-end gap-1 pl-3">
            <SortedBy />
          </div>
        </div>

        <div className="flex items-end justify-center w-full gap-2 lg:hidden">
          <Button
            onClick={() => setIsFilterModalOpen(true)}
            variant="secondaryOutlined"
            className="flex w-full gap-1"
          >
            Filters <PiSlidersHorizontalBold className="w-5" />
          </Button>
          <div className="w-full">
            <SortedBy />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categoriesParams &&
          categoriesParams.split(",").map((item, i) => (
            <Badge
              key={i}
              onClick={() =>
                resetFiltersByNameAndOptions("categories", item, setCategory)
              }
              className="flex items-center gap-1 capitalize cursor-pointer"
              variant="outline"
            >
              {item} <RxCross2 className="w-5" />
            </Badge>
          ))}

        {featuresParams &&
          featuresParams.split(",").map((item, i) => (
            <Badge
              key={i}
              onClick={() =>
                resetFiltersByNameAndOptions("features", item, setFeatures)
              }
              className="flex items-center gap-1 capitalize cursor-pointer"
              variant="outline"
            >
              {item} <RxCross2 className="w-5" />
            </Badge>
          ))}

        {pricesParams &&
          pricesParams.split(",").map((item, i) => (
            <Badge
              key={i}
              onClick={() =>
                resetFiltersByNameAndOptions("pricing", item, setPrices)
              }
              className="flex items-center gap-1 capitalize cursor-pointer "
              variant="outline"
            >
              {item.replace("_", " ")} <RxCross2 className="w-5" />
            </Badge>
          ))}

        {(categoriesParams || featuresParams || pricesParams) && (
          <div
            onClick={() => {
              replace(pathName),
                setCategory([]),
                setFeatures([]),
                setPrices([]),
                setSearchValue("");
            }}
            className="flex items-center gap-1 capitalize cursor-pointer border-b"
          >
            Clear All <RxCross2 className="w-5" />
          </div>
        )}
      </div>

      {trendingParams && (
        <div className="flex justify-between self-end p-1 -mt-10 border-2 rounded-lg w-full md:w-fit border-odtheme/5">
          <Badge
            onClick={() => setTrendingRange("today")}
            className={cn(
              "bg-transparent cursor-pointer rounded-md text-odtheme/40 py-3 px-2 md:px-4",
              trendingRange === "today" && "bg-odtheme/10 text-odtheme"
            )}
          >
            Today
          </Badge>
          <Badge
            onClick={() => setTrendingRange("this_week")}
            className={cn(
              "bg-transparent cursor-pointer rounded-md text-odtheme/40 py-3 px-2 md:px-4",
              trendingRange === "this_week" && "bg-odtheme/10 text-odtheme"
            )}
          >
            This Week
          </Badge>
          <Badge
            onClick={() => setTrendingRange("this_month")}
            className={cn(
              "bg-transparent cursor-pointer rounded-md text-odtheme/40 py-3 px-2 md:px-4",
              trendingRange === "this_month" && "bg-odtheme/10 text-odtheme"
            )}
          >
            This Month
          </Badge>
          <Badge
            onClick={() => setTrendingRange("last_month")}
            className={cn(
              "bg-transparent cursor-pointer rounded-md text-odtheme/40 py-3 px-2 md:px-4",
              trendingRange === "last_month" && "bg-odtheme/10 text-odtheme"
            )}
          >
            Last Month
          </Badge>
        </div>
      )}

      <Modal show={isModalOpen} onClose={closeModal}>
        <CategoryModal
          checkedCategory={checkedCategory}
          checkedFeatures={checkedFeatures}
          checkedPrices={checkedPrices}
          setCategory={setCategory}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          searchValue={searchValue}
        />
      </Modal>

      <FullScreenModal show={isFilterModalOpen} onClose={setIsFilterModalOpen}>
        <FilterModal
          checkedCategory={checkedCategory}
          setCategory={setCategory}
          checkedFeatures={checkedFeatures}
          setFeatures={setFeatures}
          checkedPrices={checkedPrices}
          setPrices={setPrices}
          isModalOpen={isFilterModalOpen}
          setIsModalOpen={setIsFilterModalOpen}
          searchValue={searchValue}
        />
      </FullScreenModal>
    </div>
  );
}
