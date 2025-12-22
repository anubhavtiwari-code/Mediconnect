import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import api from "../api/client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SOCKET_URL = "http://localhost:5000";

export default function ChatBox({ roomId, otherUserId, onClose }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef();
  const socketRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/chats/room/${roomId}`);
      setMessages(res.data.messages);
    };
    load();

    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit("join", { userId: user._id });
    socketRef.current.emit("join-room", { roomId });

    socketRef.current.on("chat-message", (msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const send = async () => {
    if (!text) return;

    const res = await api.post("/chats/send", {
      roomId,
      to: otherUserId,
      text,
    });

    setMessages((prev) => [...prev, res.data.message]);
    setText("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="border rounded-xl p-4 bg-white shadow-lg w-80">
      <div className="h-64 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`my-1 ${m.from === user._id ? "text-right" : "text-left"}`}
          >
            <span className="inline-block px-3 py-2 bg-gray-200 rounded-lg">
              {m.text}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border p-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={send}>
          Send
        </button>
      </div>

      <button className="mt-2 text-sm text-gray-600" onClick={onClose}>
        Close Chat
      </button>
    </div>
  );
}

