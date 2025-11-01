import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    if (!url) {
      setError("Please enter a YouTube link");
      return;
    }

    setLoading(true);
    setError("");
    setTranscript("");

    try {
      // ✅ Use your Render backend directly
      const response = await axios.get(
        `https://transcript-generator-foc1.onrender.com/api/get-transcript?url=${encodeURIComponent(url)}`,
        { responseType: "text" } // Important: tells axios to expect plain text
      );

      if (!response.data || response.data.includes("Failed") || response.data.includes("No captions")) {
        throw new Error("Transcript not found or this video has no captions.");
      }

      setTranscript(response.data);
    } catch (err) {
      console.error(err);
      setError("Transcript not found or this video has no captions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "700px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>
        🎬 YouTube Transcript Extractor
      </h1>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Paste YouTube link here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <button
          onClick={handleFetch}
          style={{
            marginLeft: "10px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Get Transcript
        </button>
      </div>

      {loading && <p style={{ marginTop: "20px" }}>Fetching transcript...</p>}

      {error && (
        <p style={{ color: "red", marginTop: "20px", fontWeight: "bold" }}>
          {error}
        </p>
      )}

      {transcript && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #eee",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
            maxHeight: "400px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>Transcript:</h3>
          <p style={{ marginTop: "10px" }}>{transcript}</p>
        </div>
      )}
    </div>
  );
}

export default App;
