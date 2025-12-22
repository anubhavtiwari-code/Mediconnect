import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { io } from "socket.io-client";
import DoctorLayout from "../layouts/DoctorLayout";

const socket = io("http://localhost:5000", { autoConnect: true });

export default function ChatPage() {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    socket.emit("join-room", appointmentId);
    load();

    socket.on("receive-message", (msg) => {
      setMessages((s) => [...s, msg]);
      scroll();
    });

    socket.on("typing", (data) => {
      setTyping(data.isTyping);
    });

    return () => {
      socket.off("receive-message");
      socket.off("typing");
    };
  }, [appointmentId]);

  const load = async () => {
    try {
      const res = await api.get(`/chat/${appointmentId}`);
      setMessages(res.data.messages || []);
      scroll();
    } catch (err) {
      console.error(err);
    }
  };

  const scroll = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  let typingTimeout;
  const sendTyping = (val) => {
    socket.emit("typing", { appointmentId, isTyping: val });
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => socket.emit("typing", { appointmentId, isTyping: false }), 1000);
  };

  const send = async () => {
    if (!text.trim()) return;
    const msg = {
      appointmentId,
      sender: userId,
      text,
      time: new Date().toISOString(),
    };
    socket.emit("send-message", msg);
    setMessages((s) => [...s, msg]);
    setText("");
    await api.post("/chat/send", msg).catch((e) => console.error(e));
    scroll();
  };

  return (
    <DoctorLayout>
      <div className="bg-white rounded-xl shadow p-4 max-w-3xl mx-auto flex flex-col h-[75vh]">
        <div className="flex items-center gap-3 border-b pb-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div>
            <div className="font-semibold">Chat</div>
            <div className="text-xs text-gray-500">{typing ? "Typing..." : "Connected"}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {messages.map((m, i) => {
            const mine = m.sender === userId;
            return (
              <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] p-2 rounded-lg ${mine ? "bg-blue-600 text-white" : "bg-gray-100 text-black"}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-gray-300 mt-1 text-right">{new Date(m.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={text}
            onChange={(e) => { setText(e.target.value); sendTyping(true); }}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            className="flex-1 border p-2 rounded"
            placeholder="Type a message..."
          />
          <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
        </div>
      </div>
    </DoctorLayout>
  );
}
