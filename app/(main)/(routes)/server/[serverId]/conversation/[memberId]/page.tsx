import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import MediaRoom from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const page = async ({ searchParams, params }: MemberIdPageProps) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }
  const currentMember = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
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
    return redirect(`/server/${params?.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={otherMember.profile.name}
        imageUrl={otherMember.profile.imageUrl}
        type={"conversation"}
        serverId={params.serverId}
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} audio={true} video={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessage
            member={otherMember}
            name={otherMember.profile.name}
            type={"conversation"}
            apiUrl="/api/direct-messages"
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
            paramKey={"conversationId"}
            paramValue={conversation.id}
            chatId={conversation.id}
          />
          <ChatInput
            apiUrl="/api/socket/direct-messages"
            query={{ conversationId: conversation.id }}
            name={otherMember.profile.name}
            type={"conversation"}
          />
        </>
      )}
    </div>
  );
};

export default page;
