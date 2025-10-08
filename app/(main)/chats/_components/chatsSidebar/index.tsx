"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { usePathname, useRouter } from "next/navigation";

import { getChats } from "@/services/user.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectJoinedChats, setChats } from "@/store/features/joinedChatsSlice";

interface Chat {
  id: number;
  chatType: "private" | "group" | "channel";
  name: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  avatar?: string;
  unread?: number;
  time?: string;
}

const ChatsSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const chats = useAppSelector(selectJoinedChats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChats();

        if (res?.data) {
          const formattedChats = res.data.map((chat: Chat) => ({
            ...chat,
            unread: 0,
            avatar: chat.avatar || "/default-avatar.png",
            time: chat.lastMessageAt
              ? new Date(chat.lastMessageAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
          }));

          dispatch(setChats(formattedChats));
        }
      } catch (_error) {
        // handle error if you want (toast, logger, etc.)
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [dispatch]);

  const isActive = (chat: Chat) =>
    pathname === `/chats/${chat.chatType}/${chat.id}`;

  return (
    <aside className="fixed top-16 right-0 w-80 h-[calc(100vh-60px)] border-r bg-white dark:bg-gray-900 z-50">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Chats
        </h2>
      </div>

      <ScrollShadow hideScrollBar className="h-[calc(100vh-64px)] p-2 pb-24">
        {loading && (
          <p className="text-gray-500 dark:text-gray-400 p-4">
            Loading chats...
          </p>
        )}

        {!loading &&
          chats.map((chat) => (
            <button
              key={`${chat.chatType}_${chat.id}`}
              aria-current={isActive(chat) ? "page" : undefined}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left ${
                isActive(chat) ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
              onClick={() => router.push(`/chats/${chat.chatType}/${chat.id}`)}
              type="button"
            >
              <Badge
                color="danger"
                content={chat.unread}
                isInvisible={chat.unread === 0}
                shape="circle"
              >
                <Avatar
                  isBordered
                  className="shrink-0"
                  radius="full"
                  size="md"
                  src={chat.avatar}
                />
              </Badge>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {chat.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {chat.lastMessage || ""}
                </p>
              </div>

              <span className="text-xs text-gray-400">{chat.time}</span>
            </button>
          ))}

        {!loading && chats.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 p-4">
            No chats found.
          </p>
        )}
      </ScrollShadow>
    </aside>
  );
};

export default ChatsSidebar;
