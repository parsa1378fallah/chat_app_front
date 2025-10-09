"use client";

import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Button } from "@heroui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/features/userSlice";
import { logout } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import CreateChannelModal from "./createChannelModal";
import CreateGroupModal from "./createGroupModal";
const profile = {
  name: "Ali Reza",
  username: "@alireza",
  status: "آنلاین",
  email: "alireza@example.com",
  phone: "+98 912 345 6789",
  birthday: "1375/06/12",
  avatar: "/avatar1.jpg",
  groups: [
    { name: "Frontend Devs", avatar: "/group1.png" },
    { name: "Family Group", avatar: "/group2.png" },
    { name: "React Enthusiasts", avatar: "/group3.png" },
  ],
  recentActivity: [
    { from: "Sara", message: "سلام! پروژه رو دیدی؟", time: "10:24" },
    { from: "Ali", message: "باشه فردا میام ✅", time: "09:10" },
    { from: "Family Group", message: "مادر: شام آماده‌ست 🍲", time: "دیروز" },
  ],
};

const ProfileSidebar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userStore = useAppSelector(selectUser);
  return (
    <aside className="fixed top-16 right-0 w-96  border-l bg-white dark:bg-gray-900 z-50">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex flex-col items-center">
        <Avatar
          src={`https://localhost:5000${userStore.profileImage}`}
          size="lg"
          isBordered
          radius="full"
          className="mb-3"
        />
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {userStore.username}
        </h2>
        <Badge
          content={profile.status === "آنلاین" ? "●" : ""}
          color={"success"}
          className="mt-2 text-xs"
        >
          <span className="text-gray-500 dark:text-gray-400">
            {profile.status}
          </span>
        </Badge>

        <Button
          className="mt-3 w-full"
          color="primary"
          onPress={() => {
            router.push(`/profile/edit`);
          }}
        >
          ویرایش پروفایل
        </Button>
      </div>

      {/* Scrollable Content */}
      <ScrollShadow
        hideScrollBar
        className="h-[calc(100vh-200px)] p-4 pb-32 space-y-6"
      >
        {/* اطلاعات پایه */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            اطلاعات پایه
          </h3>
          <p>
            <span className="font-semibold">ایمیل: </span>
            {profile.email}
          </p>
          <p>
            <span className="font-semibold">شماره تلفن: </span>
            {userStore.phone}
          </p>
          <p>
            <span className="font-semibold">تاریخ تولد: </span>
            {profile.birthday}
          </p>
        </div>

        {/* گروه‌ها و کانال‌ها */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            گروه‌ها و کانال‌ها
          </h3>
          <ul className="space-y-2">
            {profile.groups.map((group, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <Avatar src={group.avatar} size="sm" isBordered radius="full" />
                <span className="text-gray-800 dark:text-gray-200">
                  {group.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* آخرین فعالیت‌ها */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            آخرین پیام‌ها / فعالیت‌ها
          </h3>
          <ul className="space-y-2">
            {profile.recentActivity.map((act, index) => (
              <li
                key={index}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {act.from}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {act.message}
                </p>
                <span className="text-xs text-gray-400">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* دکمه‌های سریع */}
        <div className="flex flex-col gap-2 mt-4">
          <CreateChannelModal />
          <CreateGroupModal />

          <Button color="secondary" fullWidth>
            تنظیمات امنیتی
          </Button>
          <Button
            color="danger"
            fullWidth
            onPress={() => {
              dispatch(logout);
              router.push("/");
            }}
          >
            خروج از حساب
          </Button>
        </div>
      </ScrollShadow>
    </aside>
  );
};

export default ProfileSidebar;
