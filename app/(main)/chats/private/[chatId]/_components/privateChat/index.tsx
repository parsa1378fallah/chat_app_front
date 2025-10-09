"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  getPrivateMessages,
  sendPrivateMessage,
  getOtherUserInfo,
} from "@/services/privateChat.service";
import { Message } from "@/types";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { useDispatch } from "react-redux";
import { updateChat } from "@/store/features/joinedChatsSlice";
import MessageList from "./messageList";
import { ScrollShadow } from "@heroui/react";
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/avatar";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
interface Props {
  userId: number;
  chatId: number;
}
export interface otherUserInfo {
  id: number;
  username: string;
  profileImage: string | null;
  displayName: string | null;
}
export default function PrivateChat({ userId, chatId }: Props) {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const userStore = useAppSelector(selectUser);
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<otherUserInfo | null>(null);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();

  // اتصال به سوکت و دریافت پیام‌ها
  useEffect(() => {
    const socketIo = io("https://localhost:5000", { withCredentials: true });
    setSocket(socketIo);

    // عضو شدن در چت خصوصی
    socketIo.emit("joinPrivateChat", { userId, chatId });

    // دریافت پیام از سوکت
    socketIo.on("receivePrivateMessage", (msg: Message) => {
      if (msg.senderId !== userId) setMessages((prev) => [...prev, msg]);
      console.log(msg);
      const audio = new Audio("/sounds/telegram-notification.mp3");
      audio.play();

      dispatch(
        updateChat({
          id: msg.chatId,
          chatType: "private",
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
        })
      );
    });

    // دریافت تاریخچه پیام‌ها
    const fetchHistory = async () => {
      try {
        const res = await getPrivateMessages(chatId);
        setMessages(res);
      } catch (err) {
        console.error("❌ خطا در دریافت پیام‌ها:", err);
      }
    };
    const getOtherUserInformation = async () => {
      try {
        const res = await getOtherUserInfo(chatId);
        console.log("friend info", res);
        setOtherUser(res);
      } catch {}
    };

    fetchHistory();
    getOtherUserInformation();

    return () => {
      socketIo.disconnect();
    };
  }, [userId, chatId, dispatch]);

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
        chatType: "private",
        chatId: chatId,
        content: input,
        messageType: "text",
        senderProfileImage: userStore?.profileImage || "/next.svg",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        // ارسال به سرور
        await sendPrivateMessage(chatId, input);
        socket.emit("sendPrivateMessage", newMessage);

        // اضافه کردن پیام به چت فعلی
        setMessages((prev) => [...prev, newMessage]);

        // آپدیت Sidebar برای پیام خودمان
        dispatch(
          updateChat({
            id: chatId,
            chatType: "private",
            lastMessage: input,
            lastMessageAt: newMessage.createdAt,
          })
        );

        setInput("");
      } catch (err) {
        console.error("❌ خطا در ارسال پیام:", err);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col justify-end relative pt-14">
      <div className="w-full absolute top-0 right-0 flex items-center justify-between bg-slate-800 h-14 z-50 px-4 ">
        <div className="flex items-center gap-4">
          <div>
            {" "}
            <Avatar
              isBordered
              src={`https://localhost:5000${otherUser?.profileImage ?? "/next.svg"}`}
              size="sm"
              className="cursor-pointer"
              onClick={() => {}}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl">
              {otherUser?.displayName ? otherUser.displayName : "کاربر"}
            </span>
            <span className="text-xs">اخیرا مشاهده شده</span>
          </div>
        </div>
        <div className=" flex gap-1">
          <Button
            isIconOnly
            className="bg-transparent p-2"
            size="md"
            radius="full"
          >
            <MagnifyingGlassIcon />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent p-2"
            size="md"
            radius="full"
          >
            <PhoneIcon />
          </Button>
          <Button
            isIconOnly
            className="bg-transparent p-2"
            size="md"
            radius="full"
          >
            <EllipsisVerticalIcon />
          </Button>
        </div>
      </div>

      <ScrollShadow hideScrollBar>
        <div className="px-4">
          {otherUser && (
            <MessageList
              messages={messages}
              userId={userId}
              otherUser={otherUser} // حالا حتماً otherUserInfo است
            />
          )}
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
            <PaperAirplaneIcon className="rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
