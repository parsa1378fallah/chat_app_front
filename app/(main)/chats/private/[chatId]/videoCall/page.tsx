"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface VideoCallProps {
  callId: string | number;
  userId: string | number;
}

export default function VideoCall({ callId, userId }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // ساخت socket فقط روی کلاینت
    socketRef.current = io("https://localhost:5000");

    // ساخت RTCPeerConnection
    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const pc = pcRef.current;
    const socket = socketRef.current;

    // ملحق شدن به روم تماس
    socket.emit("joinCall", { callId, userId });

    // گرفتن ویدیو محلی
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      })
      .catch((err) => console.error("getUserMedia error:", err));

    // دریافت track ریموت
    pc.ontrack = (event) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = event.streams[0];
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcIceCandidate", {
          callId,
          candidate: event.candidate,
          senderId: userId,
        });
      }
    };

    // دریافت offer
    socket.on("webrtcOffer", async ({ offer, senderId }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("webrtcAnswer", { callId, answer, senderId: userId });
    });

    // دریافت answer
    socket.on("webrtcAnswer", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // دریافت ICE
    socket.on("webrtcIceCandidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch {}
    });

    // پاکسازی هنگام unmount
    return () => {
      endCall();
      socket.off("webrtcOffer");
      socket.off("webrtcAnswer");
      socket.off("webrtcIceCandidate");
      socket.disconnect();
    };
  }, [callId, userId]);

  const startCall = async () => {
    const pc = pcRef.current;
    const socket = socketRef.current;
    if (!pc || !socket) return;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtcOffer", { callId, offer, senderId: userId });
  };

  const endCall = () => {
    const pc = pcRef.current;
    const stream = localStreamRef.current;
    const socket = socketRef.current;

    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    if (pc) {
      pc.getSenders().forEach((sender) => {
        try {
          pc.removeTrack(sender);
        } catch {}
      });
      pc.close();
      pcRef.current = null;
    }

    if (socket) {
      socket.emit("leaveCall", { callId, userId });
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-65px)]">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay muted className="w-1/2 h-full" />
        <video ref={remoteVideoRef} autoPlay className="w-1/2 h-full" />
      </div>

      <div className="flex gap-2">
        <button
          onClick={startCall}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Start Call
        </button>
        <button
          onClick={endCall}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          End Call
        </button>
      </div>
    </div>
  );
}
