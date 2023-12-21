"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";
import InviteModal from "../modals/invite-modal";
import UpdateServerModal from "../modals/update-server";
import DeleteServerModal from "../modals/delete-server";
import { MembersModal } from "../modals/members-modal";
import CreateChannelModal from "../modals/create-channel-modal";
import LeaveServerModal from "../modals/leave-server";
import UpdateChannelModal from "../modals/update-channel";
import DeleteChannelModal from "../modals/delete-channel";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <UpdateServerModal />
      <DeleteServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <UpdateChannelModal />
      <DeleteChannelModal />
    </>
  );
};
