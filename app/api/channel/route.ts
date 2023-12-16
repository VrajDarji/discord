import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid'

export async function POST(req:Request){
    try{ 
    const {searchParams}=new URL(req.url);
    const serverId=searchParams.get("serverId");       const {name,type}=await req.json();
    const Id=serverId?.toString();
    const profile=await CurrentProfile();
      if(!profile){
         return new NextResponse("Unauthorized",{status:401})
     }
     const server=await db.server.update({
        where:{
            id:Id,
            members:{
                some:{
                    profileId:profile.id,
                    role:{
                        in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                    }
                }
            }
        },data:{
            channels:{
                create:{
                    profileId:profile.id,
                    name,
                    type,
                }
            }
        }
     })
     return NextResponse.json(server)
    }catch(err){
        console.log('Server',err);
        return new NextResponse("Internal Error",{status:500})
    }

}