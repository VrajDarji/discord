"use client";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Button } from "../ui/button";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import qs from "query-string";
const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channel/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      router.refresh();
      onClose();
    } catch (err) {
      console.log({ ClientError: err });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription>
            <DialogDescription className="text-center text-zinc-500">
              Are you sure you want to do this? <br />
              <span className="text-indigo-500 font-semibold">
                {channel?.name}
              </span>{" "}
              will be permanently deleted.
            </DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onClick}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;
