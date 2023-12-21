import CurrentProfilePage from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponseServerIO){
    if(req.method!=="POST"){
        return res.status(405).json({error:"Method not allowed"})
    } 
    try{
        const profile=await CurrentProfilePage(req)
        const {content,fileUrl}=req.body;
        const {serverId,channelId}=req.query;
        if (!profile) {
            return res.status(401).json({err:"Unauthorized"});
        }
        if (!serverId) {
            return res.status(400).json({err:"Server ID missing"});
        }
        if (!channelId) {
            return res.status(400).json({err:"Channel ID missing"});
        }
         if (!content) {
            return res.status(400).json({err:"Content missing"});
        }
        const server=await db.server.findFirst({
            where:{
             id:serverId as string,
             members:{
                some:{
                    profileId:profile.id,
                }
             }   
            },
            include:{
                members:true
            }
            
        })
        if(!server){
            return res.status(404).json({msg:"Server not found"});
        }
        const channel=await db.channel.findFirst({
            where:{
                id:channelId as string,
                serverId:serverId as string,
            }
        })
        if(!channel){
            return res.status(404).json({msg:"Channel not found"});
        }
        const member=server.members.find((member)=>member.profileId===profile.id);
        if(!member){
            return res.status(404).json({msg:"Member not found"});
        }
        const msg=await db.message.create({
            data:{
                content,
                fileUrl,
                channelId:channelId as string,
                memberId:member.id,
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        })
        const channelKey=`chat:${channelId}:messages`;
        res?.socket?.server?.io.emit(channelKey,msg)
        return res.status(200).json(msg)
    }catch(err){
        console.log("{MESSAGE_POST}",err);
        return res.status(500).json({message:"Error"})
        
    }   
}