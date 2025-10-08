"use client";
import React from "react";

import { Message } from "@/types";
import { Avatar } from "@heroui/avatar";

interface MessageListProps {
  messages: Message[];
  userId: number | string;
}
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return ""; // اگر تاریخ نادرست بود، چیزی نمایش ندهیم
  }
  // بازگشت فرمت ساعت و دقیقه (مثال: 17:20)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
const MessageList: React.FC<MessageListProps> = ({ messages, userId }) => {
  return (
    <div className="flex flex-col">
      {messages.map((msg) => {
        const isOwn = msg.senderId === userId;

        return (
          <div
            className={`flex   ${isOwn ? "justify-start " : "flex-row-reverse justify-end  mr-auto"} `}
            key={msg.id}
          >
            <div className=" flex items-end mb-2">
              <Avatar
                isBordered
                src={`https://localhost:5000${msg.senderProfileImage}`}
                size="sm"
                className="cursor-pointer"
                onClick={() => {}}
              />
            </div>
            <div className={`flex  my-0.5 p-2`}>
              <div
                className={`max-w-80 overflow-hidden ${
                  isOwn ? "bg-blue-700" : "bg-gray-800"
                } p-2 rounded-2xl`}
              >
                <p className="text-white break-words whitespace-pre-wrap">
                  {msg.content}
                </p>
                <span className="text-gray-400 text-sm ml-2">
                  {formatDate(msg.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
