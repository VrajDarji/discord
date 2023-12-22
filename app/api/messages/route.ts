import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGEES_BATCH=10;

export async function GET(req:Request){
    try{
        const profile=await CurrentProfile();
        const {searchParams}=new URL(req.url);
        const cursor=searchParams.get("cursor");
        const channelId=searchParams.get("channelId");
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!channelId) {
            return new NextResponse("Channel ID missing", { status: 400 });
        }
        let messages:Message[]=[];
        if(cursor){
            messages=await db.message.findMany({
                take:MESSAGEES_BATCH,
                skip:1,
                cursor:{
                    id:cursor,
                },
                where:{
                    channelId,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }else{
            messages=await db.message.findMany({
                take:MESSAGEES_BATCH,
                where:{
                    channelId,
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                },
                orderBy:{
                    createdAt:"desc"
                }
            })
        }
        let NextCursor=null;
        if(messages.length===MESSAGEES_BATCH){
            NextCursor=messages[MESSAGEES_BATCH-1].id
        }
        return NextResponse.json({
            items:messages,
            NextCursor,
        })
    }
    catch(err){
        console.log({Server:err});
        return new NextResponse("Error",{status:500})
        
    }
}