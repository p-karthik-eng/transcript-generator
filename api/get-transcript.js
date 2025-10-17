import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(req, res) {
  try {
    const videoUrl = req.method === "GET" ? req.query.url : req.body?.url;

    if (!videoUrl) {
      return res.status(400).json({ error: "Missing YouTube URL" });
    }

    // Robust video ID extraction
    const videoIdMatch = videoUrl.match(
      /(?:youtube\.com\/.*v=|youtu\.be\/)([0-9A-Za-z_-]{11})/
    );

    if (!videoIdMatch) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const videoId = videoIdMatch[1];

    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcript || transcript.length === 0) {
      return res
        .status(404)
        .json({ error: "No captions found for this video" });
    }

    res.status(200).json({ transcript });
  } catch (err) {
    console.error("Error fetching transcript:", err);
    res
      .status(500)
      .json({ error: "Transcript not available", details: err.message });
  }
}
