"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";
import { CiShare1 } from "react-icons/ci";

import { cn } from "@/lib/utils";
import Badge from "@/components/badges/Badge";
import Button from "@/components/buttons/Button";
import imagePlaceHolder from "@/public/images/image-placeholder.webp";
import { signIn, useSession } from "next-auth/react";
import { patchUserTool } from "@/services/user/toolsService";

import { toast } from "sonner";
import { PiSealCheckFill } from "react-icons/pi";

const pricingOptions = [
  { label: "Select pricing", value: "" },
  { label: "Free", value: "FREE" },
  { label: "Freemium", value: "FREEMIUM" },
  { label: "Free Trial", value: "FREE_TRIAL" },
  { label: "Premium", value: "PREMIUM" },
  { label: "Contact for Price", value: "CONTACT_FOR_PRICE" },
];

export default function ToolCard({ tool, refetch }) {
  const [isHoverActive, setIsHoverActive] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const toolDetailsLink = `/tools/${tool.slug}`;

  function findLabelByValue(targetValue) {
    const foundOption = pricingOptions.find(
      (option) => option.value === targetValue
    );

    if (foundOption) {
      return foundOption.label;
    } else {
      // Return a default label or handle the case where the value is not found
      return "Label not found";
    }
  }

  function handleLoveSubmit() {
    if (!isAuthenticated) {
      signIn("google");
    } else {
      const payload = {
        save_count: tool.is_loved ? tool.save_count - 1 : tool.save_count + 1,
        slug: tool.slug,
      };

      const promise = patchUserTool(tool.slug, payload)
        .then((res) => {
          refetch();
        })
        .catch((err) => {
          throw err;
        });

      toast.promise(promise, {
        loading: "Saving your tool",
        success: "Tools saved successfully",
        error: "Failed...!, Please try again",
      });
    }
  }

  return (
    <div
      id="card"
      className="p-0.5 border border-odtheme/10 rounded-2xl flex flex-col"
    >
      <div
        id="card-top"
        className="relative h-40 overflow-hidden rounded-t-2xl"
      >
        <Link href={toolDetailsLink}>
          <Image
            width={600}
            height={600}
            src={tool.image || imagePlaceHolder}
            alt="card-banner"
            className={cn(
              "w-full h-full object-cover transform transition-transform duration-300",
              isHoverActive && "shadow-lg scale-105"
            )}
            onMouseLeave={() => setIsHoverActive(false)}
            onMouseEnter={() => setIsHoverActive(true)}
          />
        </Link>

        <div className="absolute flex items-center gap-4 bottom-3 left-3">
          {tool.is_featured ? (
            <Badge variant="primary" className="flex items-center gap-1 py-1">
              <BsStarHalf className="w-3 h-3 text-odtheme" /> Featured
            </Badge>
          ) : null}
          {tool.is_new ? (
            <Badge variant="warning" className="py-1">
              New
            </Badge>
          ) : null}
        </div>
      </div>

      <div id="card-content" className="flex-1 p-3 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant={
              findLabelByValue(tool.pricing) == "Free"
                ? "successTransparent"
                : findLabelByValue(tool.pricing) == "Freemium"
                ? "semiWarningTransparent"
                : "dangerTransparent"
            }
          >
            {findLabelByValue(tool.pricing)}
          </Badge>
          <Badge
            onClick={() => handleLoveSubmit()}
            variant="dynamic"
            className="flex items-center gap-1 rounded cursor-pointer"
          >
            <AiFillHeart className={`w-4 h-4 ${tool.is_loved ? "text-red-600" : "text-gray-500"}`} /> {tool.save_count} 
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {tool.is_verified && (
            <PiSealCheckFill className="w-5 h-5 text-green-500" />
          )}
          <Link
            href={toolDetailsLink}
            className={`text-xl font-semibold`}
            onMouseLeave={() => setIsHoverActive(false)}
            onMouseEnter={() => setIsHoverActive(true)}
          >
            {tool.name}
          </Link>
          <Badge variant="dynamic" className="flex items-center gap-1 rounded">
            <BsStarHalf className="w-3 h-3 text-odtheme" />
            {tool.average_ratings || "0"}
          </Badge>
        </div>

        <Link
          href={toolDetailsLink}
          onMouseLeave={() => setIsHoverActive(false)}
          onMouseEnter={() => setIsHoverActive(true)}
        >
          {tool.short_description}
        </Link>

        <div id="category" className="flex items-center gap-1">
          {tool.sub_category.length > 0 && tool.sub_category.map((sc, i) => (
            <Link key={i} href={`ai-tools/${sc.slug}`}>
              <Badge variant="dynamic">{sc.title}</Badge>
            </Link>
          ))}
        </div>
      </div>

      <div id="actions" className="flex p-3 border-t-2 border-odtheme/10">
        <Link
          href={tool.website_url}
          rel={tool.do_follow_website ? "dofollow" : "nofollow"}
        >
          <Button variant="secondaryOutlined">
            Visit Site
            <CiShare1 className="w-4 h-4 text-odtheme" />
          </Button>
        </Link>
        <Link href={toolDetailsLink}>
          <Button variant="text">More Details</Button>
        </Link>
      </div>
    </div>
  );
}
