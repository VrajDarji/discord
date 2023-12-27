"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField } from "../ui/form";
import { Loader2, Plus, Smile } from "lucide-react";
import { Input } from "../ui/input";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/useModalStore";
import EmojiPicker from "../EmojiPicker";
import { useRouter } from "next/navigation";
import { useState } from "react";
interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "conversation";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput: React.FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (err) {
      console.log({ clientError: err });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormControl>
              <div className="relative p-4 pb-6">
                <button
                  type="button"
                  onClick={() => {
                    onOpen("messageFile", { apiUrl, query });
                  }}
                  className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                >
                  <Plus className="text-white dark:text-[#313338]" />
                </button>
                <Input
                  disabled={isLoading}
                  className="px-14 py-6 bg-zinc-20/90 dark:bg-zinc-700/75 border-none focus-visible:rinf-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                  placeholder={`Message ${
                    type === "conversation" ? name : "#" + name
                  }`}
                  {...field}
                />
                <div className="absolute top-7 right-8">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <EmojiPicker
                      onChange={(emoji: string) => {
                        field.onChange(`${field.value}${emoji}`);
                      }}
                    />
                  )}
                </div>
              </div>
            </FormControl>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
