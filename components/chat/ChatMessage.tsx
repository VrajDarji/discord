"use client";

import { Member, Message, Profile } from "@prisma/client";
import ChatWelcome from "./ChatWelcome";
import { useChatQuery } from "@/hooks/useChatQuey";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";
import { format } from "date-fns";
import ChatItem from "./ChatItem";
import { useChatSocket } from "@/hooks/use-chat-socket";

interface ChatMessageProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:message:update`
  const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });
  useChatSocket({ queryKey, addKey, updateKey });
  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading mesaages...
        </p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }
  return (
    <div className="flex-1 flex-col overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome name={name} type={"channel"} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.items.map((msg: MessageWithMemberWithProfile) => {
                return (
                  <ChatItem
                    key={msg.id}
                    id={msg.id}
                    content={msg.content}
                    deleted={msg.deleted}
                    fileUrl={msg.fileUrl}
                    timeStamp={format(
                      new Date(msg.createdAt),
                      "d MMMM yyyy,HH:mm"
                    )}
                    currentMember={member}
                    member={msg.member}
                    isUpdated={msg.updatedAt !== msg.createdAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                  />
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessage;
