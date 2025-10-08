"use client";

import { useRouter } from "next/navigation";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Kbd } from "@heroui/kbd";
import { Avatar } from "@heroui/avatar";
import { ThemeSwitch } from "@/components/theme-switch";
import { selectUser } from "@/store/features/userSlice";
import { useAppSelector } from "@/store/hooks";
import SearchChat from "./searchChats";

import { BellIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Logo } from "@/components/icons";
import GetProfileClient from "../getProfileClient";
const Navbar = () => {
  const userStore = useAppSelector(selectUser);
  const router = useRouter();

  return (
    <>
      {" "}
      <GetProfileClient />
      <HeroUINavbar maxWidth="xl" position="sticky">
        {/* سمت چپ (لوگو / برند) */}
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-2 max-w-fit">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <Logo />
              <p className="font-bold text-inherit">ParsaChat</p>
            </div>
          </NavbarBrand>
        </NavbarContent>

        {/* منوی دسکتاپ */}
        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          {userStore.isLoggedIn ? (
            <>
              <NavbarItem className="hidden lg:flex">
                <SearchChat />
              </NavbarItem>

              <NavbarItem>
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  aria-label="New Chat"
                >
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </NavbarItem>

              <NavbarItem>
                <Button
                  isIconOnly
                  radius="full"
                  variant="light"
                  aria-label="Notifications"
                  onClick={() => router.push("/notifications")}
                >
                  <BellIcon className="w-5 h-5" />
                </Button>
              </NavbarItem>

              <NavbarItem>
                <ThemeSwitch />
              </NavbarItem>

              <NavbarItem>
                <Avatar
                  isBordered
                  src={`https://localhost:5000${userStore.profileImage}`}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => router.push("/profile")}
                />
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Button
                  color="primary"
                  variant="flat"
                  onClick={() => router.push("/login")}
                >
                  ورود
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  color="secondary"
                  variant="flat"
                  onClick={() => router.push("/register")}
                >
                  ثبت نام
                </Button>
              </NavbarItem>
              <NavbarItem>
                <ThemeSwitch />
              </NavbarItem>
            </>
          )}
        </NavbarContent>

        {/* موبایل */}
        <NavbarContent className="sm:hidden basis-1 pl-4 z-50" justify="end">
          <ThemeSwitch />
          <NavbarMenuToggle />
        </NavbarContent>

        {/* منوی موبایل */}
        <NavbarMenu className="z-[999]">
          {userStore.isLoggedIn ? (
            <>
              <SearchChat />
              <div className="mx-4 mt-2 flex flex-col gap-2 ">
                <NavbarMenuItem>
                  <Button
                    fullWidth
                    startContent={<PlusIcon />}
                    variant="light"
                    onClick={() => router.push("/new-chat")}
                  >
                    پیام جدید
                  </Button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Button
                    fullWidth
                    startContent={<BellIcon />}
                    variant="light"
                    onClick={() => router.push("/notifications")}
                  >
                    نوتیفیکیشن‌ها
                  </Button>
                </NavbarMenuItem>
                <NavbarMenuItem>
                  <Button
                    fullWidth
                    startContent={<Avatar src="/avatar.jpg" size="sm" />}
                    variant="light"
                    onClick={() => router.push("/profile")}
                  >
                    پروفایل من
                  </Button>
                </NavbarMenuItem>
              </div>
            </>
          ) : (
            <div className="mx-4 mt-2 flex flex-col gap-2">
              <NavbarMenuItem>
                <Button
                  fullWidth
                  color="primary"
                  variant="flat"
                  onClick={() => router.push("/login")}
                >
                  ورود
                </Button>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Button
                  fullWidth
                  color="secondary"
                  variant="flat"
                  onClick={() => router.push("/register")}
                >
                  ثبت نام
                </Button>
              </NavbarMenuItem>
            </div>
          )}
        </NavbarMenu>
      </HeroUINavbar>
    </>
  );
};

export default Navbar;
