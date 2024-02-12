"use client";
import Image from "next/image";
import Link from "next/link";

import { AiFillHeart, AiFillTwitterCircle } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import {
  FaDiscord,
  FaFacebook,
  FaLinkedin,
  FaReceipt,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { HiShare } from "react-icons/hi";

import Badge from "@/components/badges/Badge";
import Button from "@/components/buttons/Button";
import { useQuery } from "@tanstack/react-query";
import ToolsDetails from "@/components/skeleton/toolsDetails/ToolsDetails";
import { BsArrowRightShort, BsPatchQuestion } from "react-icons/bs";
import {
  getUserToolDetails,
  patchUserTool,
} from "@/services/user/toolsService";
import Rating from "./Rating";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";
import { format } from "date-fns";
import AddFeedback from "./AddFeedback";
import RatingCard from "./RatingCard";
import AverageRating from "./AverageRating";
import {
  MdCancel,
  MdEmail,
  MdOutlineVerified,
  MdSwapVert,
} from "react-icons/md";
import ToolsVerification from "./ToolsVerification";
import ToolCard from "@/components/cards/ToolCard";

import imagePlaceHolder from "@/public/images/image-placeholder.webp";
import { IoLogoGithub } from "react-icons/io";
import instagram from "@/public/images/icons/instagram.png";
import InfoButton from "@/components/buttons/InfoButton";

const pricingOptions = [
  { label: "Select pricing", value: "" },
  { label: "Free", value: "FREE" },
  { label: "Freemium", value: "FREEMIUM" },
  { label: "Free Trial", value: "FREE_TRIAL" },
  { label: "Premium", value: "PREMIUM" },
  { label: "Contact for Price", value: "CONTACT_FOR_PRICE" },
];

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

export default function DetailsPage({ params }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const {
    isLoading,
    data: tool,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [`tools/${params.slug}`],
    queryFn: () => getUserToolDetails(params.slug).then((res) => res.data),
  });

  if (isLoading) {
    return <ToolsDetails />;
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

  const handleShare = (title) => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: "",
        })
        .then((data) => data)
        .catch((error) => console.log("Error sharing", error));
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-5 md:flex-row">
        <div className="w-full space-y-9 md:w-1/2">
          <div className="flex flex-col flex-wrap items-start justify-start gap-3 lg:flex-row lg:justify-between">
            <div className="flex flex-col gap-6">
              <h1 className="flex items-center gap-3 text-4xl font-semibold">
                {tool.name}{" "}
                <HiShare
                  onClick={() => handleShare(tool.name)}
                  className="w-5 h-5 cursor-pointer"
                />
              </h1>
              <p className="block max-w-md lg:hidden lg:max-w-sm">
                {tool.short_description}
              </p>
            </div>
            <div className="flex gap-2.5">
              <Button onClick={handleLoveSubmit} variant="secondary">
                <FaReceipt className="w-5 h-5 text-odtheme/40" />
                <span className="font-medium text-odtheme">Save</span>
              </Button>
              <Button onClick={handleLoveSubmit} variant="secondary">
                <AiFillHeart
                  className={`w-4 h-4 ${
                    tool.is_loved ? "text-red-600" : "text-gray-500"
                  }`}
                />
                <span className="text-odtheme">{tool.save_count}</span>
              </Button>

              {tool.do_sponsor_website ? (
                <Link href={tool.website_url} rel="sponsored" target="_blank">
                  <Button variant="dynamic">
                    Visit Site <BiLinkExternal className="w-5 h-5" />
                  </Button>
                </Link>
              ) : tool.do_follow_website ? (
                <Link href={tool.website_url} target="_blank">
                  <Button variant="dynamic">
                    Visit Site <BiLinkExternal className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link
                  href={tool.website_url}
                  rel="nofollow noopener"
                  target="_blank"
                >
                  <Button variant="dynamic">
                    Visit Site <BiLinkExternal className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
            <div className="block w-full md:w-1/2 md:hidden">
              <Image
                width={800}
                height={800}
                src={tool.image || imagePlaceHolder}
                alt="card-banner"
                className="w-full h-full object-cover rounded-md max-h-48 lg:max-h-[359px]"
              />
            </div>
          </div>

          <p className="hidden max-w-md lg:block lg:max-w-sm">
            {tool.short_description}
          </p>

          {/* left side tools details  */}
          <div className="space-y-7">
            <div className="flex items-center gap-3">
              <h2 className="w-2/5 font-semibold text-odtheme/40">
                Verification
              </h2>
              <div className="w-3/5">
                {tool.is_verified ? (
                  <p className="relative flex items-center gap-1 font-bold text-green-600">
                    <MdOutlineVerified className="w-5 h-5" /> Verified
                    <InfoButton
                      infoIcon={<BsPatchQuestion className="w-5 h-4" />}
                      infoText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    />
                  </p>
                ) : (
                  <p className="flex items-center gap-1 font-bold text-odtheme/40">
                    <MdCancel className="w-5 h-5 text-odtheme/40" /> Unverified
                    <InfoButton
                      infoIcon={<BsPatchQuestion className="w-5 h-4" />}
                      infoText="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    />
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="w-2/5 font-semibold text-odtheme/40">
                Popular alternative
              </h2>
              {tool?.alternative_tool.save_count > 0 ? (
                <div className="flex flex-col flex-wrap items-start w-3/5 gap-1 font-medium md:flex-row">
                  <Link href={`/tools/${tool.alternative_tool.slug}`}>
                    <span className="underline">
                      {tool?.alternative_tool.name}
                    </span>
                    ({tool?.alternative_tool.save_count} Saves)
                  </Link>
                </div>
              ) : (
                <p>No popular alternative found yet !</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <h2 className="w-2/5 font-semibold text-odtheme/40">Pricing</h2>
              <div className="flex flex-col flex-wrap items-start w-3/5 gap-2 md:flex-row">
                <p>{findLabelByValue(tool.pricing)}</p>
                {tool.pricing_url && (
                  <Link
                    className="flex items-center font-semibold underline text-odtheme/40"
                    href={tool.pricing_url}
                  >
                    Check Pricing Plans{" "}
                    <BsArrowRightShort className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="w-2/5 font-semibold text-odtheme/40">Rating</h2>
              <div className="flex flex-col flex-wrap items-start w-3/5 gap-1 md:flex-row">
                <div className="flex flex-col items-start gap-1 md:flex-row md:items-center">
                  <Rating averageRating={tool.average_ratings} />
                  {/* ({tool.average_ratings || "0.00"}) */}
                  {tool.ratings.length > 0 && (
                    <Link href="#review-section">
                      ({tool.ratings.length} Reviews)
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="w-2/5 font-semibold text-odtheme/40">
                Categories
              </h2>
              <div className="flex flex-wrap w-3/5 gap-1">
                {tool.sub_category.map((item) => (
                  <Badge key={item.slug} variant="dynamic">
                    <Link href={`/ai-tools/${item.slug}`}>{item.title}</Link>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <h2 className="w-2/5 font-semibold text-odtheme/40">
                Added date
              </h2>
              <div className="w-3/5">
                {format(new Date(tool.created_at), "LLLL dd, yyyy")} <br />
                <small className="text-odtheme/60">
                  Updated: {format(new Date(tool.created_at), "LLLL yyyy")}
                </small>
              </div>
            </div>
            {(tool.email_url ||
              tool.facebook_url ||
              tool.twitter_url ||
              tool.tiktok_url ||
              tool.youtube_url ||
              tool.linkedin_url ||
              tool.github_url ||
              tool.discoard_url) && (
              <div className="flex items-center gap-3">
                <h2 className="w-2/5 font-semibold text-odtheme/40">
                  Social links
                </h2>
                <div className="flex flex-wrap w-3/5 gap-1">
                  {tool.email_url && (
                    <Link href={tool.email_url}>
                      <MdEmail className="w-6 h-6 text-blue-300" />
                    </Link>
                  )}
                  {tool.facebook_url && (
                    <Link href={tool.facebook_url}>
                      <FaFacebook className="w-6 h-6 text-blue-800" />
                    </Link>
                  )}
                  {tool.twitter_url && (
                    <Link href={tool.twitter_url}>
                      <AiFillTwitterCircle className="w-6 h-6 text-blue-600" />
                    </Link>
                  )}
                  {tool.tiktok_url && (
                    <Link href={tool.tiktok_url}>
                      <FaTiktok className="w-6 h-6 text-blue-400" />
                    </Link>
                  )}
                  {tool.facebook_url && (
                    <Link href={tool.facebook_url}>
                      <Image
                        alt="instagram"
                        className="w-6 h-6"
                        src={instagram}
                      />
                    </Link>
                  )}
                  {tool.youtube_url && (
                    <Link href={tool.youtube_url}>
                      <FaYoutube className="w-6 h-6 text-red-500" />
                    </Link>
                  )}
                  {tool.linkedin_url && (
                    <Link href={tool.linkedin_url}>
                      <FaLinkedin className="w-6 h-6 text-blue-900" />
                    </Link>
                  )}
                  {tool.github_url && (
                    <Link href={tool.github_url}>
                      <IoLogoGithub className="w-6 h-6 text-blue-700" />
                    </Link>
                  )}
                  {tool.discoard_url && (
                    <Link href={tool.discoard_url}>
                      <FaDiscord className="w-6 h-6 text-sky-500" />
                    </Link>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <h2 className="w-2/5 font-semibold text-odtheme/40">Features</h2>
              <div className="flex flex-wrap items-center w-3/5 gap-1">
                {tool.feature.map((item) => (
                  <Badge key={item.slug} variant="dynamic">
                    {item.title}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="hidden w-full md:w-1/2 md:block">
          <Image
            width={800}
            height={800}
            src={tool.image || imagePlaceHolder}
            alt="card-banner"
            className="w-full h-full object-cover rounded-md max-h-48 lg:max-h-[359px]"
          />
        </div>
      </div>

      {/* Verification tools section */}
      <ToolsVerification
        toolsName={tool.name}
        url={tool.website_url}
        code={tool.verification_code}
        index_no={tool.index_no}
        params={params}
        is_verified={tool.is_verified}
      />

      <div className="flex flex-col justify-between gap-2 md:flex-row">
        <div className="w-full md:w-3/5">
          <div
            className="override-style"
            dangerouslySetInnerHTML={{ __html: tool.description }}
          />
        </div>

        <div
          id="review-section"
          className="flex flex-col justify-center w-full md:w-2/5 h-fit"
        >
          <AddFeedback slug={tool.slug} refetch={refetch} />
          <AverageRating
            averageRating={tool.average_ratings}
            ratings_distribution={tool.ratings_distribution}
            rating_count={tool.ratings.length}
          />
          <div className="py-4 divide-y divide-odtheme/10">
            {tool.ratings.length ? (
              tool.ratings.map((item, i) => (
                <RatingCard key={i} item={item} created_at={tool.created_at} />
              ))
            ) : (
              <p className="text-sm font-bold">There is no reviews yet.</p>
            )}
          </div>
        </div>
      </div>
      <hr />

      <div className="">
        <div className="flex items-center gap-1">
          <MdSwapVert className="text-2xl font-extrabold text-primary-500 md:text-5xl" />
          <p className="text-2xl font-semibold md:text-4xl">
            {tool.related_tools.length} Alternatives To {tool.name}
          </p>
        </div>
        <div className="space-y-11">
          <div className="grid gap-2 mt-6 grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4">
            {tool.related_tools.length > 0 ? (
              tool.related_tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} refetch={refetch} />
              ))
            ) : (
              <p>No Alternative Tools Found Yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
