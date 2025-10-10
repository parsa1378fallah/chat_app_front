"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUI, setShowSidebar } from "@/store/features/uiSlice";
import ChatsSidebar from "../chatsSidebar";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const dispatch = useAppDispatch();
  const { showSidebar } = useAppSelector(selectUI);

  return (
    <div className="relative flex flex-col">
      <div className={`${showSidebar ? `visible w-full` : `hidden`} sm:flex`}>
        <ChatsSidebar />
      </div>

      <main
        className={` ${!showSidebar ? `` : `hidden`} sm:block  sm:mr-80 overflow-auto `}
        style={{ backgroundImage: "url('/chatbg.jpg')" }}
      >
        {children}
      </main>
    </div>
  );
}
