import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL required" });

  try {
    const proxyRes = await axios.post(`${process.env.PROXY_URL}/api/transcript`, { url });
    res.json(proxyRes.data);
  } catch (err) {
    res.status(500).json({ error: "Proxy fetch failed", details: err.message });
  }
});

export default router;
