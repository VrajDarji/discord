import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import MediaRoom from "@/components/media-room";
import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
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
      id: params?.channelId,
    },
  });
  const member = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id,
    },
  });
  if (!channel || !member) {
    redirect("/");
  }
  return (
    <>
      <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
          serverId={channel.serverId}
          name={channel.name}
          type="channel"
        />
        {channel.type === ChannelType.TEXT && (
          <>
            <ChatMessage
              member={member}
              name={channel.name}
              type={"channel"}
              apiUrl="/api/messages"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              paramKey={"channelId"}
              paramValue={channel.id}
              chatId={channel.id}
            />

            <ChatInput
              apiUrl="/api/socket/messages"
              query={{ channelId: channel.id, serverId: channel.serverId }}
              name={channel.name}
              type={"channel"}
            />
          </>
        )}
        {channel.type === ChannelType.AUDIO && (
          <MediaRoom chatId={channel.id} audio={true} video={false} />
        )}
        {channel.type === ChannelType.VIDEO && (
          <MediaRoom chatId={channel.id} audio={true} video={true} />
        )}
      </div>
    </>
  );
};

export default page;
