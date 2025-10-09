"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  getChannelMessages,
  sendChannelMessage,
  isChannelOwner,
} from "@/services/channelChat.service";
import { Message } from "@/types";

interface Props {
  userId: number;
  channelId: number;
}
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
import { updateChat } from "@/store/features/joinedChatsSlice";
import MessageList from "@/app/(main)/chats/_components/messageList";
export default function ChannelChat({ userId, channelId }: Props) {
  const dispatch = useAppDispatch();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const userStore = useAppSelector(selectUser);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const socketIo = io("https://localhost:5000", {
      withCredentials: true,
    });
    setSocket(socketIo);

    // Join the channel chat
    socketIo.emit("joinChannelChat", { userId, channelId });

    // Listen for new messages
    socketIo.on("receiveChannelMessage", (msg) => {
      if (msg.senderId !== userId) setMessages((prev) => [...prev, msg]);
      console.log(msg);
      dispatch(
        updateChat({
          id: msg.chat_id,
          chatType: "channel",
          lastMessage: msg.content,
          lastMessageAt: msg.created_at,
        })
      );
    });
    const isThisUserOwner = async () => {
      try {
        const isUserOwner = await isChannelOwner(channelId);
        console.log(isUserOwner);
        isUserOwner ? setIsOwner(true) : setIsOwner(false);
      } catch (e) {
        console.log(e);
      }
    };
    // Fetch message history
    const fetchHistory = async () => {
      try {
        const res = await getChannelMessages(channelId);
        setMessages(res);
        console.log("xxx");
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };
    isThisUserOwner();
    fetchHistory();

    return () => {
      socketIo.disconnect();
    };
  }, [userId, channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (socket && input.trim() !== "") {
      const newMessage: Message = {
        id: Date.now(),
        senderId: userId,
        chatType: "channel",
        chatId: channelId,
        content: input,
        messageType: "text",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        senderProfileImage: userStore?.profileImage || "/next.svg",
      };

      try {
        await sendChannelMessage(channelId, input);
        socket.emit("sendChannelMessage", newMessage);

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
      } catch (err) {
        console.error("❌ Error sending message:", err);
      }
    }
  };

  return (
    <div className=" px-4 py-8  min-h-svh flex flex-col justify-end  ">
      <div>
        <MessageList messages={messages} userId={userId} />

        <div ref={messagesEndRef} />
      </div>

      {isOwner && (
        <div className="flex justify-center gap-5">
          <Input
            placeholder="Enter your message"
            value={input}
            onChange={(e: any) => setInput(e.target.value)}
          />
          <Button onPress={sendMessage}>Send</Button>
        </div>
      )}
    </div>
  );
}
