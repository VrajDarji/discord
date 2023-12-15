import { useEffect, useState } from "react"

export const useOrigin=()=>{
    const [isMOunted,setIsMounted]=useState(false);
    useEffect(()=>{
        setIsMounted(true)
    },[]);

    const origin=typeof window!=='undefined' && window.location.origin?window.location.origin:'';

    if(!isMOunted){
        return "";
    }
    return origin;
}