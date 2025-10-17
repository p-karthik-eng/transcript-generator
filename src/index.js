import express from "express";
import { exec } from "child_process";

const app = express();
app.use(express.json());

app.get("/api/get-transcript", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "Missing YouTube URL" });

  const cmd = `./yt-dlp --cookies cookies.txt --skip-download --write-auto-sub --sub-format json --sub-lang en --print-json "${videoUrl}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: "Failed to fetch transcript", details: stderr });

    try {
      const lines = stdout.trim().split("\n");
      const lastLine = lines[lines.length - 1];
      const data = JSON.parse(lastLine);

      if (!data.subtitles || !data.subtitles.en)
        return res.status(404).json({ error: "No captions found" });

      const transcript = data.subtitles.en.map(item => ({
        start: item.start,
        duration: item.duration,
        text: item.text
      }));

      res.json({ transcript });
    } catch (err) {
      res.status(500).json({ error: "Failed to parse transcript", details: err.message });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
