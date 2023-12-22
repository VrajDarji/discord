import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = ()=>{
    const {userId}=auth();
    if(!userId){
        throw new Error("Unauthorized")
    }
    return {userId:userId};
}
 
export const ourFileRouter = {
    serverImage:f({image:{maxFileCount:1,maxFileSize:"4MB"}})
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
    messageFile:f(['image','pdf','video/mp4','audio/mpeg'])
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;