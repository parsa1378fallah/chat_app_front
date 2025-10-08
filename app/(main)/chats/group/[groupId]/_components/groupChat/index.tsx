"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  getGroupMessages,
  sendGroupMessage,
} from "@/services/groupChat.service";
import { Message } from "@/types";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { useDispatch } from "react-redux";
import { updateChat, incrementUnread } from "@/store/features/joinedChatsSlice";
import { ScrollShadow } from "@heroui/react";
import MessageList from "@/app/(main)/chats/_components/messageList";
interface Props {
  userId: number;
  groupId: number;
}

export default function GroupChat({ userId, groupId }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  // اتصال به سوکت و دریافت پیام‌ها
  useEffect(() => {
    const socketIo = io("https://localhost:5000", { withCredentials: true });
    setSocket(socketIo);

    // عضو شدن در گروه
    socketIo.emit("joinGroupChat", { userId, groupId });

    // دریافت پیام‌ها از سوکت
    socketIo.on("receiveGroupMessage", (msg: Message) => {
      if (msg.senderId !== userId) setMessages((prev) => [...prev, msg]);
      console.log(msg);
      dispatch(
        updateChat({
          id: msg.chat_id,
          chatType: "group",
          lastMessage: msg.content,
          lastMessageAt: msg.created_at,
        })
      );
    });

    // دریافت تاریخچه پیام‌ها
    const fetchHistory = async () => {
      try {
        const res = await getGroupMessages(groupId);
        setMessages(res.data.groupMessages);
      } catch (err) {
        console.error("❌ خطا در دریافت پیام‌ها:", err);
      }
    };

    fetchHistory();

    return () => {
      socketIo.disconnect();
    };
  }, [userId, groupId, dispatch]);

  // اسکرول خودکار به انتهای پیام‌ها
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ارسال پیام
  const sendMessage = async () => {
    if (socket && input.trim() !== "") {
      const newMessage: Message = {
        id: Date.now(),
        senderId: userId,
        chat_type: "group",
        chat_id: groupId,
        content: input,
        message_type: "text",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      try {
        await sendGroupMessage(groupId, input);
        socket.emit("sendGroupMessage", newMessage);

        setMessages((prev) => [...prev, newMessage]);

        // آپدیت Sidebar برای پیام خودمان
        dispatch(
          updateChat({
            id: groupId,
            chatType: "group",
            lastMessage: input,
            lastMessageAt: newMessage.created_at,
          })
        );

        setInput("");
      } catch (err) {
        console.error("❌ خطا در ارسال پیام:", err);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col justify-end">
      <ScrollShadow hideScrollBar>
        <div className="px-4">
          <MessageList messages={messages} userId={userId} />
          <div ref={messagesEndRef} />
        </div>
      </ScrollShadow>

      <div className=" relative h-14 mt-4">
        <div className="w-full h-full abolute bottom-0 right-0 flex justify-center">
          {" "}
          <Input
            radius="none"
            classNames={{
              inputWrapper: "h-14", // ارتفاع کل باکس
              input: "h-14 ", // ارتفاع ناحیه متن
            }}
            placeholder="پیام خود را وارد کنید"
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button className="rounded-none h-14" onPress={sendMessage}>
            ارسال
          </Button>
        </div>
      </div>
    </div>
  );
}
