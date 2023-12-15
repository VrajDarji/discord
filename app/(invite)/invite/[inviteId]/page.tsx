import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: { inviteId: string } }) => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }
  if (!params.inviteId) {
    return redirect("/");
  }
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existingServer) {
    return redirect(`/server/${existingServer.id}`);
  }
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteId,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });
  if (server) {
    return redirect(`/server/${server.id}`);
  }
  return null;
};

export default page;
