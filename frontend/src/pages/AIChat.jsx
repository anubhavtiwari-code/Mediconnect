import { useEffect, useRef, useState } from "react";
import api from "../api/client";


export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your MediConnect AI Assistant. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    try {
      const res = await api.post("ai/chat", { message: input });


      const aiReply = res.data.reply;

      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error: Unable to connect to AI." }
      ]);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ padding: 30, maxWidth: 600, margin: "auto" }}>
      <h2>MediConnect AI Assistant</h2>

      <div
        style={{
          height: 500,
          border: "1px solid #ccc",
          padding: 15,
          borderRadius: 10,
          overflowY: "auto",
          background: "#fafafa"
        }}
      >
        {messages.map((m, index) => (
          <div
            key={index}
            style={{
              marginBottom: 12,
              textAlign: m.role === "user" ? "right" : "left"
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 10,
                background: m.role === "user" ? "#b3e5fc" : "#e0e0e0",
                maxWidth: "80%"
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          style={{
            width: "80%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            marginLeft: 10,
            borderRadius: 8
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
