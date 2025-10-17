import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(req, res) {
  try {
    const method = req.method;
    let videoUrl;

    if (method === "GET") {
      videoUrl = req.query.url;
    } else if (method === "POST") {
      videoUrl = req.body.url;
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!videoUrl) {
      return res.status(400).json({ error: "Missing YouTube URL" });
    }

    // Robust video ID extraction
    const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
    if (!videoIdMatch) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    const videoId = videoIdMatch[1];

    // Fetch transcript
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.status(200).json({ transcript });

  } catch (err) {
    console.error("Error fetching transcript:", err);
    res.status(500).json({ error: "Transcript not available", details: err.message });
  }
}
