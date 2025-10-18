import express from "express";
import { fetchTranscript } from "../utils/ytDlpHandler.js";
const router = express.Router();

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "YouTube URL required" });

  try {
    const transcript = await fetchTranscript(url);
    res.json({ success: true, transcript });
  } catch (err) {
    console.error("Transcript fetch failed:", err);
    res.status(500).json({ error: "Failed to fetch transcript", details: err.toString() });
  }
});

export default router;
