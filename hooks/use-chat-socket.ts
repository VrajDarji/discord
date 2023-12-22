import { useSocket } from "@/components/provider/socket-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Message,Member,Profile } from "@prisma/client";
type ChatSocketProps={
    addKey:string;
    updateKey:string;
    queryKey:string;
}
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};
export const useChatSocket=({
    addKey,updateKey,queryKey
}:ChatSocketProps)=>{
    const {socket}=useSocket();
    const queryClient=useQueryClient()
    useEffect(()=>{
     if(!socket){
        return;
    }
    socket.on(updateKey,(msg:MessageWithMemberWithProfile)=>{
        // @ts-ignore
        queryClient.setQueriesData([queryKey],(oldData:any)=>{
            if(!oldData || !oldData.pages || oldData.pages.length===0){
                return oldData;
            }
            const newData=oldData.pages.map((page:any)=>{
                return{
                    ...page,
                    items:page.items.map((item:MessageWithMemberWithProfile)=>{
                        if(item.id===msg.id){
                            return msg;
                        }
                        return item;
                    })
                }
            })
            return {
                ...oldData,
                pages:newData
            }
        })
    });
    socket.on(addKey,(msg:MessageWithMemberWithProfile)=>{
        // @ts-ignore
        queryClient.setQueriesData([queryKey],(oldData:any)=>{
             if(!oldData || !oldData.pages || oldData.pages.length===0){
                return {
                    pages:[{
                        items:[msg],
                    }]
                };
            }
            const newData=[...oldData.pages];
            newData[0]={
                ...newData[0],
                items:[
                    msg,
                    ...newData[0].items,
                ]
            }
            return {
                ...oldData,
                pages:newData
            }

        })
    })

    return()=>{
        socket.off(addKey);
        socket.off(updateKey);
    }
},[addKey,updateKey,queryKey,socket,queryClient])
}