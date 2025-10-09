"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  joinChannelChat,
  getChannelMessages,
} from "@/services/channelChat.service";

interface Message {
  id: number; // شناسه پیام
  senderId: number; // آیدی فرستنده
  chatType: string; // نوع چت (private, group, channel و غیره)
  chatId: number; // آیدی چت مربوطه
  content: string; // محتوای پیام
  messageType: string; // نوع پیام (text, image و غیره)
  createdAt: string; // تاریخ ایجاد پیام (timestamp)
  updatedAt: string; // تاریخ آخرین بروزرسانی
  senderProfileImage: string;
}

export default function ChannelPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const channelId = Number(params.channelId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getChannelMessages(channelId);
        setMessages(res);
      } catch {
        setError("خطا در دریافت پیام‌ها");
      }
    };
    fetchMessages();
  }, [channelId]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinChannelChat(channelId);
      router.replace(`/chats/channel/${channelId}`); // بعد از عضویت → برو به صفحه اصلی کانال
    } catch (err: any) {
      setError(err.response?.data?.message || "خطا در پیوستن");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* پیام‌ها */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="border-b pb-2">
            <p className="font-bold">{msg.senderId}</p>
            <p>{msg.content}</p>
            <span className="text-xs text-gray-500">{msg.createdAt}</span>
          </div>
        ))}
      </div>

      {/* دکمه عضویت */}
      <div className="p-4 border-t">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          onClick={handleJoin}
          disabled={loading}
          className="w-full px-4 py-2 rounded bg-blue-500 text-white"
        >
          {loading ? "در حال پیوستن..." : "عضویت در کانال"}
        </button>
      </div>
    </div>
  );
}
