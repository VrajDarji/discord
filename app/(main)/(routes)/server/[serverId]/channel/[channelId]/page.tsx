import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: { serverId: string; channelId: string };
}) => {
  const profile = await CurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });
  const members = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !members) {
    redirect("/");
  }
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type="channel"
      />
      <div className="flex-1"></div>
      <ChatInput
        apiUrl="/api/socket/messages"
        query={{ channelId: channel.id, serverId: channel.serverId }}
        name={channel.name}
        type={"channel"}
      />
    </div>
  );
};

export default page;