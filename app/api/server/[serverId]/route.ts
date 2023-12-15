import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function DELETE(req:Request,
    {params}:{params:{serverId:string}}) {
    try{
        const profile=await CurrentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        const server=await db.server.delete({
        where:{
            id:params.serverId,
            profileId:profile.id,
        }
    })    
    
    return NextResponse.json(server);
    
}catch(err){
        console.log({ServerError:err});
        return new NextResponse("Error",{status:500})
    }    
}

export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    try{
        const {name,imageUrl}=await req.json();
        const profile=await CurrentProfile();
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        if(!name){
            return new NextResponse("name required",{status:400})
        }
        if(!imageUrl){
            return new NextResponse("image required",{status:400})
        }
        const server=await db.server.update({
            where:{
                id:params.serverId,
                profileId:profile.id,
            },
            data:{
                name,
                imageUrl,
            }
        })
        return NextResponse.json(server);
        
    }
    catch(err){
        console.log(err);
        
    }
}
export async function GET(req:Request,{params}:{params:{serverId:string}}) {
    return NextResponse.json({message:params.serverId})
}