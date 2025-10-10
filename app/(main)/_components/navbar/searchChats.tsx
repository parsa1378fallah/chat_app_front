"use client";

import { useState, useEffect } from "react";
import { searchChats } from "@/services/search.service";
import { SearchChatItem } from "@/types";

import Link from "next/link";
export default function ChatSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const handleRoute = (item: SearchChatItem) => {
    if (item.isMember) return `/chats/${item.chatType}/${item.chatId}`;
    else {
      if (item.chatType === "private")
        return `/chats/private/newChat/${item.id}`;
      if (item.chatType === "group")
        return `/chats/group/joinGroupChat/${item.id}`;
      if (item.chatType === "channel")
        return `/chats/channel/joinChannelChat/${item.id}`;
      return `/`;
    }
  };
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchChats(query);
        console.log(res); // استفاده از سرویس
        setResults(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      {/* Input سرچ */}
      <input
        type="text"
        placeholder="جستجو کنید..."
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* نتایج مستطیلی زیر نوبار */}
      {query.length >= 4 && results.length > 0 && (
        <div className="absolute z-[500] top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg  max-h-80 overflow-y-auto">
          {loading && <div className="p-2 text-gray-500">Loading...</div>}
          {results.map((item) => (
            <Link key={`${item.id}_${item.chatType}`} href={handleRoute(item)}>
              {" "}
              <div className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b last:border-b-0">
                <span>{item.name}</span>
                <span className="text-sm text-gray-400">
                  {item.chatType === "private"
                    ? "کاربر"
                    : item.chatType === "group"
                      ? "گروه"
                      : "کانال"}
                  {item.isMember ? " ✅" : ""}
                  {`${item.id}`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* وقتی هیچ نتیجه‌ای نیست */}
      {query.length >= 4 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-2 text-gray-500">
          نتیجه‌ای یافت نشد
        </div>
      )}
    </div>
  );
}
