import express from "express";
import { YoutubeTranscript } from "youtube-transcript";

const app = express();
app.use(express.json());

app.get("/api/get-transcript", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "Missing URL" });

    const match = videoUrl.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([0-9A-Za-z_-]{11})/);
    if (!match) return res.status(400).json({ error: "Invalid URL" });

    const videoId = match[1];
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || transcript.length === 0)
      return res.status(404).json({ error: "No captions found" });

    res.json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcript not available", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
