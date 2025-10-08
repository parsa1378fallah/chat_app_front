"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { joinGroupChat, getGroupMessages } from "@/services/groupChat.service";

interface Message {
  id: number;
  sender: string;
  text: string;
  createdAt: string;
}

export default function GroupPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = Number(params.groupId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getGroupMessages(groupId);
        setMessages(res.data.groupMessages || []);
      } catch {
        setError("خطا در دریافت پیام‌ها");
      }
    };
    fetchMessages();
  }, [groupId]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinGroupChat(groupId);
      router.replace(`/chats/group/${groupId}`); // بعد از عضویت → برو به صفحه اصلی گروه
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
            <p className="font-bold">{msg.sender}</p>
            <p>{msg.text}</p>
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
          className="w-full px-4 py-2 rounded bg-green-500 text-white"
        >
          {loading ? "در حال پیوستن..." : "عضویت در گروه"}
        </button>
      </div>
    </div>
  );
}
