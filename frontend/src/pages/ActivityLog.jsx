// src/pages/admin/ActivityLog.jsx
import { useEffect, useState } from "react";
import api from "../api/client";

export default function ActivityLog(){
  const [items, setItems] = useState([]);
  useEffect(()=>{
    const load = async () => {
      const res = await api.get("/admin/activity");
      setItems(res.data.items || []);
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
      <div className="space-y-3">
        {items.map(it => (
          <div key={it._id} className="p-3 border rounded">
            <div className="text-sm text-gray-600">{new Date(it.createdAt).toLocaleString()}</div>
            <div className="font-medium">{it.message}</div>
            <pre className="text-xs text-gray-500 mt-2">{JSON.stringify(it.meta || {}, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
