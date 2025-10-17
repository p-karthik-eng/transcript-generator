import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const videoId = url.split("v=")[1]?.split("&")[0];
    if (!videoId) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.status(200).json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Transcript not available for this video" });
  }
}
