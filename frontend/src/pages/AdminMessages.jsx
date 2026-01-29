import { useEffect, useState } from "react";
import api from "../api/client";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await api.get("/admin/messages");
      setMessages(res.data.messages);
    } catch (err) {
      console.log(err);
    }
  };
 const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this message?"
  );

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/contact/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (res.ok) {
      // remove message from UI instantly
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      alert("Message deleted");
    } else {
      alert(data.message || "Failed to delete");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Contact Messages</h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="border p-4 rounded-lg shadow">
            <p><b>Name:</b> {msg.name}</p>
            <p><b>Email:</b> {msg.email}</p>
            <p><b>Message:</b> {msg.message}</p>
            <button
             onClick ={()=> handleDelete (msg._id)}
             className="delete-btn"> Delete     </button>
            <p className="text-gray-500 text-sm pt-2">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
