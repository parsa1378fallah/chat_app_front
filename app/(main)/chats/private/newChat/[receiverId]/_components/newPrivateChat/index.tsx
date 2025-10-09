"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { initPrivateChat } from "@/services/privateChat.service";

const NewPrivateChat = ({ receiverId }: { receiverId: number }) => {
  const router = useRouter();
  const hasInitialized = useRef(false); // ✅ جلوگیری از اجرا دوباره

  useEffect(() => {
    const initChat = async () => {
      if (hasInitialized.current) return; // اگر قبلاً اجرا شده، خارج شو
      hasInitialized.current = true;

      try {
        if (receiverId) {
          const chat = await initPrivateChat(receiverId);
          console.log("Chat initialized:", chat);
          router.replace(`/chats/private/${chat.id}`);
        }
      } catch (err) {
        console.error("Error initializing private chat:", err);
      }
    };

    initChat();
  }, [receiverId, router]);

  return <div>در حال آماده‌سازی چت خصوصی...</div>;
};

export default NewPrivateChat;
