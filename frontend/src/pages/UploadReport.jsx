import { useContext, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/client";
import { AuthContext } from "../context/AuthContext";

export default function UploadReport() {
  const { user } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [notes, setNotes] = useState("");
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [feedback, setFeedback] = useState("");

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];

  // -------------------------------
  // FILE HANDLER
  // -------------------------------
  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!allowedTypes.includes(selected.type)) {
      toast.error("❌ Only JPG, PNG or PDF allowed!");
      e.target.value = "";
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      toast.error("❌ Max file size is 10MB");
      e.target.value = "";
      return;
    }

    setFile(selected);
    setFeedback("");

    if (selected.type !== "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else {
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  // -------------------------------
  // SUBMIT HANDLER
  // -------------------------------
  const submit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Choose a file");

    const patientId = user?._id;
    if (!patientId) {
      toast.error("User ID missing. Cannot upload report.");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("notes", notes);
    fd.append("patientId", patientId);

    setProcessing(true);
    setFeedback("🔍 Processing your document… OCR is running…");

    try {
      await api.post("/records/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          const p = Math.round((ev.loaded * 100) / ev.total);
          setProgress(p);
        },
      });

      setFeedback("✅ Perfect! This is a valid medical report.");
      toast.success("Upload successful");

      setFile(null);
      setPreview("");
      setNotes("");
      setProgress(0);
    } catch (err) {
      console.error(err?.response?.data || err);

      const errorMessage = err?.response?.data?.error;

      if (errorMessage?.includes("Only medical")) {
        setFeedback("❌ This is NOT a medical report. Please upload a valid medical report.");
        toast.error("This is NOT a medical report.");
      } else {
        setFeedback("⚠ Upload failed. Please try again.");
        toast.error("Upload failed");
      }
    }

    setProcessing(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Medical Report</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Upload your reports to get AI-powered insights and share them instantly with doctors.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-blue-700">Before You Upload</h3>
        <ul className="mt-2 text-sm text-gray-700 space-y-1">
          <li>• Only upload <b>valid medical reports</b> such as prescriptions, lab tests, bills, etc.</li>
          <li>• Supported formats: <b>JPG, PNG, PDF</b></li>
          <li>• Maximum file size: <b>10 MB</b></li>
          <li>• Ensure the text is <b>clear and readable</b> for better OCR results.</li>
        </ul>
      </div>

      <form onSubmit={submit} className="space-y-4">

        <input 
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFile}
        />

        {preview && (
          <div className="mt-4 border rounded p-3 bg-gray-50">
            <h3 className="font-medium mb-2">Preview:</h3>

            {file?.type !== "application/pdf" && (
              <img 
                src={preview}
                alt="Preview"
                className="max-h-80 rounded shadow-md"
              />
            )}

            {file?.type === "application/pdf" && (
              <iframe
                src={preview}
                className="w-full h-80 border rounded"
                title="PDF Preview"
              ></iframe>
            )}
          </div>
        )}

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full border p-2 rounded"
        />

        {progress > 0 && !processing && (
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              style={{ width: `${progress}%` }}   // ✔ FIXED
              className="h-2 bg-blue-600 rounded"
            />
          </div>
        )}

        {processing && (
          <div className="flex items-center gap-3 text-blue-700 mt-2">
            <div className="loader"></div>
            <span>Processing document… (OCR running)</span>
          </div>
        )}

        <style>
          {`
            .loader {
              border: 4px solid #d1d5db;
              border-top: 4px solid #2563eb;
              border-radius: 50%;
              width: 28px;
              height: 28px;
              animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        {feedback && (
          <div
            className={`mt-3 p-3 rounded text-center text-lg font-medium ${
              feedback.startsWith("❌")
                ? "bg-red-100 text-red-700"
                : feedback.startsWith("⚠")
                ? "bg-yellow-100 text-yellow-700"
                : feedback.startsWith("🔍")
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {feedback}
          </div>
        )}

        <button
          type="submit"
          disabled={processing}
          className={`px-4 py-2 rounded text-white ${
            processing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {processing ? "Processing…" : "Upload"}
        </button>
      </form>
    </div>
  );
}
