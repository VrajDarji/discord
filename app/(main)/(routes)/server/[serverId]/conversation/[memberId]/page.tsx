import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import { getOrCreateConversation } from "@/lib/conversation";
import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({
  params,
}: {
  params: { memberId: string; serverId: string };
}) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });
  if (!currentMember) {
    return redirect("/");
  }
  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );
  if (!conversation) {
    return redirect(`/server/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        type={"conversation"}
        name={otherMember.profile.name}
        serverId={params.serverId}
      />
      <div className="flex-1">Future Messages</div>
      <ChatInput
        apiUrl="/api/socket/direct-messages"
        query={{ conversationId: conversation.id }}
        name={otherMember.profile.name}
        type={"conversation"}
      />
    </div>
  );
};

export default page;
