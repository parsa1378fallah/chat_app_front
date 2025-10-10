"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { ThemeProviderProps } from "next-themes";
import { useEffect } from "react";

// UI & Theme
import { HeroUIProvider } from "@heroui/system";
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Redux
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

// 🔹 برای HeroUI Router Type Fix
declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  const router = useRouter();

  return (
    <ReduxProvider store={store}>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider />
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </ReduxProvider>
  );
}
