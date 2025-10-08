"use client";

import { useParams } from "next/navigation";
import PrivateChat from "./_components/privateChat";
import { selectUser } from "@/store/features/userSlice";
import { useAppSelector } from "@/store/hooks";
export default function ChatPage() {
  const params = useParams();
  const userStore = useAppSelector(selectUser);
  const chatId = params.chatId as string;

  return <PrivateChat userId={Number(userStore.id)} chatId={Number(chatId)} />;
}
