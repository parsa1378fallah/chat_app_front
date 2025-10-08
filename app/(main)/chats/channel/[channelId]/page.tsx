"use client";

import { useParams } from "next/navigation";
import ChannelChat from "./_components/channelChat";
import { selectUser } from "@/store/features/userSlice";
import { useAppSelector } from "@/store/hooks";

export default function ChatPage() {
  const params = useParams();
  const userStore = useAppSelector(selectUser);
  const channelId = Number(params.channelId); // ✅ تبدیل به عدد

  return (
    <ChannelChat userId={Number(userStore.id)} channelId={Number(channelId)} />
  );
}
