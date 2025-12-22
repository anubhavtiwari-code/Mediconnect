// src/components/QRModal.jsx
import React from "react";
import QRCode from "react-qr-code";

export default function QRModal({ url, onClose }) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[320px] text-center">
        <h2 className="text-lg font-semibold mb-4">Scan QR Code</h2>

        <div className="bg-gray-100 p-4 rounded-xl flex justify-center">
          <QRCode value={url} size={200} />
        </div>

        <p className="text-sm text-gray-600 mt-3 break-all">{url}</p>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}
