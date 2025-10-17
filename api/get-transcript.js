import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // ✅ Allow both GET and POST
    const method = req.method;
    let videoUrl;

    if (method === "GET") {
      videoUrl = req.query.url;
    } else if (method === "POST") {
      const body = await req.json?.() || req.body;
      videoUrl = body?.url;
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!videoUrl) {
      return res.status(400).json({ error: "Missing YouTube URL" });
    }

    // Extract video ID
    const videoIdMatch = videoUrl.match(/(?:v=|youtu\.be\/)([^&]+)/);
    if (!videoIdMatch) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    const videoId = videoIdMatch[1];

    // ✅ External proxy (bypasses region blocks)
    const apiUrl = `https://youtubetranscript.com/?server=1&video_id=${videoId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Proxy API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.error) {
      return res.status(404).json({ error: "Transcript not found or video has no captions" });
    }

    // ✅ Return the transcript
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
