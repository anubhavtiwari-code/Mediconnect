import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function GenerateQR() {
  const { recordId } = useParams();
  const [minutes, setMinutes] = useState(5);
  const [qrImage, setQrImage] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);

  const generateQR = async () => {
    try {
      const res = await api.post("/qrshare/generate", { recordId, expiresInMinutes: minutes });
      setQrImage(res.data.qrImage);
      setQrUrl(res.data.qrUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to generate QR");
    }
  };

  return (
    <Container>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Generate QR Share</h2>
        <Card>
          <div className="flex items-center gap-3">
            <input type="number" min="1" className="border rounded-md p-2" value={minutes} onChange={(e)=>setMinutes(e.target.value)} />
            <Button onClick={generateQR}>Generate</Button>
          </div>

          {qrImage && (
            <div className="mt-6 text-center">
              <img src={qrImage} alt="qr" className="mx-auto w-48 h-48" />
              <pre className="mt-3 break-all bg-gray-50 p-3 rounded-md text-sm">{qrUrl}</pre>
            </div>
          )}
        </Card>
      </div>
    </Container>
  );
}

