import React from "react";
import { intialProfile } from "@/lib/intial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import IntialModal from "@/components/modals/intial-modal";

const page = async () => {
  const profile = await intialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/server/${server.id}`);
  }
  return (
    <div>
      <IntialModal />
    </div>
  );
};

export default page;
