"use client";

import { useParams } from "next/navigation";
import GroupChat from "./_components/groupChat";
import { selectUser } from "@/store/features/userSlice";
import { useAppSelector } from "@/store/hooks";

export default function ChatPage() {
  const params = useParams();
  const userStore = useAppSelector(selectUser);
  const groupId = params.groupId as string;

  return <GroupChat userId={Number(userStore.id)} groupId={Number(groupId)} />;
}
