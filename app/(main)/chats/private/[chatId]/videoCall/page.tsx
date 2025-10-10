"use client";

import ProfessionalJitsi from "./_components/videoCall";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
import { useParams } from "next/navigation";

export default function CallPage() {
  const params = useParams();
  const userStore = useAppSelector(selectUser);

  // chatId ممکنه string | string[] | undefined باشه، پس cast می‌کنیم به string
  const chatId = Array.isArray(params.chatId)
    ? params.chatId[0]
    : (params.chatId ?? "default");

  return (
    <div className="h-screen">
      <ProfessionalJitsi
        roomName={`chatRoom_${chatId}`}
        userName={userStore.username ?? "x user"}
        chatId={chatId}
      />
    </div>
  );
}
