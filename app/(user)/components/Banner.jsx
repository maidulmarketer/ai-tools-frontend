"use client";
import Badge from "@/components/badges/Badge";
import Button from "@/components/buttons/Button";

import { FaHandPeace } from "react-icons/fa";
import { BiPlus } from "react-icons/bi";
import { BsTools } from "react-icons/bs";
import { getCounts } from "@/services/user/toolsService";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/components/modal/Modal";
import GoogleAuthButton from "@/components/navigation/GoogleAuthButton";
import { toast } from "sonner";

export default function Banner() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const { data: allCount, refetch } = useQuery({
    queryKey: ["tools-filters-count"],
    queryFn: () => getCounts().then((res) => res.data),
  });

  function handleSubmitTools() {
    if (!isAuthenticated) {
      return setIsModalOpen(true);
    }

    if (data.user?.role === "admin") {
      return toast.error("Oops, you are an admin!");
    }

    router.push("/submit-ai-tools");
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-14 bg-opacity-5">
      <h1 className="text-5xl font-semibold text-center sm:text-7xl justify-items-center">
        Discover
        <span className="font-bold text-gradient">Latest AI tools</span>
        <br /> in various categories
      </h1>
      <Badge
        className="flex items-center justify-center gap-2 text-lg font-semibold"
        variant="dynamic"
      >
        <FaHandPeace className="w-5 h-5 text-yellow-400" />{" "}
        {allCount?.today_created_tools} tools added today
      </Badge>
      <div className="flex justify-center gap-2">
        <Button className="items-center gap-2" variant="dynamic">
          <BsTools className="w-4 h-4" /> {allCount?.total_tools} AI Tools
        </Button>
        <Button
          onClick={() => handleSubmitTools()}
          className="gap-2"
          variant="dynamic"
        >
          <BiPlus className="w-5 h-5" /> Submit A Tool
        </Button>
      </div>

      <Modal show={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
          <span className="text-lg font-bold">
            To Submit your Tools you have to login !!
          </span>{" "}
          <GoogleAuthButton />
        </div>
      </Modal>
    </div>
  );
}
