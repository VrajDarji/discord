import { NextResponse } from "next/server";

export async function GET({params}:{params:{memberId:string}}) {
    return NextResponse.json(params.memberId)
    
}