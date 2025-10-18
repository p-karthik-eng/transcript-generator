import express from "express";
import { fetchTranscript } from "../utils/ytDlpHandler.js";

const router = express.Router();

// GET endpoint for browser testing
router.get("/", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Error: YouTube URL required");

  try {
    const transcript = await fetchTranscript(url);
    res.type("text/plain").send(transcript);
  } catch (err) {
    res.status(500).send(`Failed to fetch transcript:\n${err.toString()}`);
  }
});

export default router;
