import CurrentProfile from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { serverId: string } }) => {
  const profile = await CurrentProfile();
  if (!profile) {
    redirect(`/sign-in`);
  }
  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
  const intialChannels = server?.channels[0];
  if (intialChannels?.name !== "general") {
    return null;
  }

  return redirect(`/server/${params.serverId}/channel/${intialChannels?.id}`);
};

export default page;
