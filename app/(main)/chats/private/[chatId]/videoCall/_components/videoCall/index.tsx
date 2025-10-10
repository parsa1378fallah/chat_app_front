"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface ProfessionalJitsiProps {
  roomName: string;
  userName: string;
  chatId: string;
}

export default function ProfessionalJitsi({
  roomName,
  userName,
  chatId,
}: ProfessionalJitsiProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (window.JitsiMeetExternalAPI && containerRef.current) {
      const domain = "meet.jit.si";
      const options = {
        roomName,
        width: "100%",
        height: 600,
        parentNode: containerRef.current,
        userInfo: { displayName: userName },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "hangup",
            "chat",
            "tileview",
            "fullscreen",
          ],
        },
      };

      const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
      setApi(jitsiApi);

      jitsiApi.addEventListener("audioMuteStatusChanged", ({ muted }: any) =>
        setIsAudioMuted(muted)
      );
      jitsiApi.addEventListener("videoMuteStatusChanged", ({ muted }: any) =>
        setIsVideoMuted(muted)
      );

      jitsiApi.addEventListener("readyToClose", () => {
        router.push(`/chats/private/${chatId}`);
      });

      // 🚨 ریدایرکت هنگام بستن یا reload صفحه
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (jitsiApi) jitsiApi.executeCommand("hangup");
        router.push(`/chats/private/${chatId}`);
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        jitsiApi.dispose();
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [roomName, userName, chatId, router]);

  const toggleAudio = () => api && api.executeCommand("toggleAudio");
  const toggleVideo = () => api && api.executeCommand("toggleVideo");
  const hangup = () => {
    if (api) {
      api.executeCommand("hangup");
      router.push(`/chats/private/${chatId}`);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-2 p-2 bg-gray-800">
        <button
          onClick={toggleAudio}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          {isAudioMuted ? "Unmute Mic" : "Mute Mic"}
        </button>
        <button
          onClick={toggleVideo}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          {isVideoMuted ? "Turn On Video" : "Turn Off Video"}
        </button>
        <button
          onClick={hangup}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Hangup
        </button>
      </div>

      <div ref={containerRef} className="flex-1" />
    </div>
  );
}
