"use client";

import React, { useEffect } from "react";
import { getProfile } from "@/services/user.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { login, logout } from "@/store/features/userSlice";
import { useRouter } from "next/navigation";

export default function GetProfileClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        // بررسی localStorage قبل از درخواست
        console.log(
          "localStorage accessToken:",
          localStorage.getItem("accessToken")
        );
        console.log(
          "localStorage refreshToken:",
          localStorage.getItem("refreshToken")
        );

        const profile = await getProfile();
        router.push("/chats");
        dispatch(
          login({
            id: profile.id ?? null,
            username: profile.username ?? null,
            email: profile.email ?? null,
            phone: profile.phone ?? null,
            bio: profile.bio ?? null,
            profileImage: profile.profileImage ?? null,
            isLoggedIn: true,
          })
        );
      } catch (err) {
        dispatch(logout());
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
  }, []);

  return <></>;
}
