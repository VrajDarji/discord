"use client";

import { FileIcon, X, Mic, Video } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "serverImage" | "messageFile";
}

const FileUpload: React.FC<FileUploadProps> = ({
  endpoint,
  value,
  onChange,
}) => {
  const fileType = value?.split(".").pop();
  
  if (value && endpoint === "messageFile") {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 file-indigo-200" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferre"
          className="ml-2 text-sm text-indigo dark:text-indigo-400 hover:underline"
        >
          {value}
        </a>
        <button
          className="absolute bg-rose-500 text-white p-1 rounded-full -top-2 -right-2 shadow-sm"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};

export default FileUpload;
