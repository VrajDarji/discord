import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface UseAvatarProps {
  src?: string;
  className?: string;
}

const UseAvatar: React.FC<UseAvatarProps> = ({ src, className }) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UseAvatar;
