"use client";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "@/services/admin/categoryService";
import Button from "@/components/buttons/Button";
import { BiSolidDashboard } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

export default function CategoryModal({
  isModalOpen,
  setIsModalOpen,
  checkedCategory,
  setCategory,
  checkedFeatures,
  checkedPrices,
  searchValue,
}) {
  const { replace } = useRouter();
  const pathName = usePathname();

  const {
    isLoading,
    isError,
    data: category,
  } = useQuery({
    queryKey: ["category-filter"],
    queryFn: () => getCategories().then((res) => res.data),
  });

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCategory([...checkedCategory, value]);
    } else {
      setCategory(checkedCategory.filter((item) => item !== value));
    }
  };

  function generateURL(checkedCategory, checkedFeatures, checkedPrices) {
    let categoryParam =
      checkedCategory.length > 0 ? `categories=${checkedCategory.join()}` : "";
    let featureParam =
      checkedFeatures.length > 0 ? `features=${checkedFeatures.join()}` : "";
    let priceParam =
      checkedPrices.length > 0 ? `pricing=${checkedPrices.join()}` : "";
    let searchParam = searchValue
      ? `search=${searchValue.split(" ").join("+")}`
      : "";

    // Combine all parameters
    let queryParams = [
      searchParam,
      categoryParam,
      featureParam,
      priceParam,
    ].filter(Boolean);

    // Construct the final URL
    let url = pathName;
    if (queryParams.length > 0) {
      url += `?${queryParams.join("&")}`;
    }
    return url;
  }

  return (
    <div className="space-y-2 relative h-full">
      <div className="flex items-center justify-between pb-6 border-b border-odtheme/10">
        {checkedCategory.length > 0 ? (
          <div
            onClick={() => setCategory([])}
            className="flex gap-1 items-center underline underline-offset-4 cursor-pointer"
          >
            <RxCross2 className="w-4 h-4" /> Clear All
          </div>
        ) : (
          <div className="flex items-center justify-start gap-1 font-semibold">
            <BiSolidDashboard className="w-5 h-5 text-primary-400" />
            <p>Category</p>
          </div>
        )}
        <button
          className="self-end text-odtheme focus:outline-none"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <span className="sr-only">Close menu</span>
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>

      {/* main body  */}
      <div className="space-y-5 overflow-y-auto text-odtheme h-[360px] md:h-96">
        <div className="space-y-4 sm:space-y-5">
          {category?.results.map((item) => (
            <div key={item.slug} className="space-y-6">
              <p className="font-bold"> {item.title}</p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {item.subcategory.length
                  ? item.subcategory.map((item) => (
                      <label
                        key={item.slug}
                        className="flex gap-x-2.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={item.slug}
                          onChange={handleCheckboxChange}
                          checked={checkedCategory.includes(item.slug)}
                          className="accent-primary-400"
                        />
                        <span>
                          {item.title}{" "}
                          <span className="text-odtheme/50">
                            ({item.total_tools})
                          </span>
                        </span>
                      </label>
                    ))
                  : "No Sub Category Added yet"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2.5 absolute bottom-0 w-full bg-dtheme">
        <Button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="justify-center w-full"
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            const url = generateURL(
              checkedCategory,
              checkedFeatures,
              checkedPrices,
              searchValue
            );
            replace(url), setIsModalOpen(!isModalOpen);
          }}
          className="justify-center w-full"
        >
          Show Results
        </Button>
      </div>
    </div>
  );
}
