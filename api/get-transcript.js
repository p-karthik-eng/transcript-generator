export default async function handler(req, res) {
  try {
    const method = req.method;
    let videoUrl;

    if (method === "GET") {
      videoUrl = req.query.url;
    } else if (method === "POST") {
      const body = req.body;
      videoUrl = body?.url;
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!videoUrl) {
      return res.status(400).json({ error: "Missing YouTube URL" });
    }

    // Extract video ID
    const match = videoUrl.match(/(?:v=|youtu\.be\/)([^&]+)/);
    if (!match) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    const videoId = match[1];

    // Use native fetch (Vercel Node 18+ supports this)
    const apiUrl = `https://youtubetranscript.com/?server=1&video_id=${videoId}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: `Proxy API returned status ${response.status}` });
    }

    const data = await response.json();

    if (!data || data.error) {
      return res
        .status(404)
        .json({ error: "Transcript not found or video has no captions" });
    }

    // Return transcript
    res.status(200).json(data);
  } catch (err) {
    console.error("Transcript fetch error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
