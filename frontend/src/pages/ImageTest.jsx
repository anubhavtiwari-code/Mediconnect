// src/pages/ImageTest.jsx
import React from "react";

const TEST_IMAGES = [
  "/assets/doc1.png",
  "/assets/doc2.png",
  "/assets/doc3.png",
  "/assets/doctors/doc1.png",
  "/assets/appointment_img.png",
];

export default function ImageTest() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Image test</h2>
      <p>Open this page to see which images load and which 404.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {TEST_IMAGES.map((src) => (
          <div key={src} style={{ border: "1px solid #eee", padding: 12 }}>
            <div style={{ height: 160, background: "#f7fbff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={src}
                alt={src}
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                onError={(e) => { e.target.src = "/assets/doctor_icon.svg"; e.target.style.opacity = 0.6; }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, wordBreak: "break-all" }}>{src}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
