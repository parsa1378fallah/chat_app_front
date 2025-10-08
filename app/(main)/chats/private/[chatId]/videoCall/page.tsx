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
    socketRef.current = io("https://localhost:5000");

    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const pc = pcRef.current;
    const socket = socketRef.current;

    socket.emit("joinCall", { callId, userId });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      })
      .catch((_err) => {
        // خطا را در صورت نیاز هندل کن
      });

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcIceCandidate", {
          callId,
          candidate: event.candidate,
          senderId: userId,
        });
      }
    };

    socket.on("webrtcOffer", async ({ offer, _senderId }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtcAnswer", { callId, answer, senderId: userId });
    });

    socket.on("webrtcAnswer", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("webrtcIceCandidate", async ({ candidate }) => {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        // ignore errors safely
      }
    });

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
        } catch {
          // ignore
        }
      });

      pc.close();
      pcRef.current = null;
    }

    if (socket) {
      socket.emit("leaveCall", { callId, userId });
    }
  };

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col gap-4">
      <div className="flex gap-4">
        <video autoPlay className="h-full w-1/2" muted ref={localVideoRef}>
          <track kind="captions" />
        </video>

        <video autoPlay className="h-full w-1/2" ref={remoteVideoRef}>
          <track kind="captions" />
        </video>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded bg-green-600 px-3 py-1 text-white"
          onClick={startCall}
          type="button"
        >
          Start Call
        </button>

        <button
          className="rounded bg-red-600 px-3 py-1 text-white"
          onClick={endCall}
          type="button"
        >
          End Call
        </button>
      </div>
    </div>
  );
}
