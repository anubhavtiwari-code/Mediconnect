import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Checkin() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.post(`/appointments/checkin/${token}`);
        setStatus("ok");
        setMsg("Check-in successful. Please wait for your appointment.");
      } catch (err) {
        setStatus("error");
        setMsg(err?.response?.data?.error || "Check-in failed");
      }
    };
    run();
  }, [token]);

  return (
    <div className="p-6 max-w-md mx-auto">
      {status === "loading" ? <p>Checking token...</p> :
        status === "ok" ? <div className="text-green-600">{msg}</div> :
        <div className="text-red-600">{msg}</div>
      }
    </div>
  );
}
