import React, { useEffect, useState } from "react";
import DoctorLayout from "../layouts/DoctorLayout";
import api from "../api/client";
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
} from "recharts";

export default function Earnings() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ week: 0, month: 0, year: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        // backend needs to expose aggregated earnings endpoint,
        // fallback: load appointments and compute
        const res = await api.get("/appointments/my");
        const appts = res.data.appointments || [];

        // compute basic chart data: earnings per day for last 7 days
        const map = {};
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(now.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          map[key] = 0;
        }
        appts.forEach((a) => {
          if (a.status === "done") {
            const day = (a.date || "").slice(0, 10);
            if (map[day] !== undefined) map[day] += a.fees || 0;
          }
        });

        const chart = Object.keys(map).map(k => ({ date: k, earnings: map[k] }));
        setData(chart);

        const week = chart.reduce((s, c) => s + c.earnings, 0);
        const month = appts.filter(a => a.status === "done").reduce((s, a) => s + (a.fees || 0), 0);
        setSummary({ week, month, year: month * 1 }); // simple year estimate
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Earnings</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">This week</div>
            <div className="text-2xl font-bold">₹{summary.week}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">This month</div>
            <div className="text-2xl font-bold">₹{summary.month}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">This year</div>
            <div className="text-2xl font-bold">₹{summary.year}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mt-4">
          <h3 className="mb-3 font-semibold">Earnings (last 7 days)</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="earnings" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
