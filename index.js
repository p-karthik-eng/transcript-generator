import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(express.json());

// Helper to convert VTT time to seconds
function parseTime(t) {
  const parts = t.split(":");
  return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2].replace(",", "."));
}

// Parse VTT text into JSON
function parseVtt(vttText) {
  const lines = vttText.split("\n");
  const transcript = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("-->")) {
      const [start, end] = lines[i].split(" --> ");
      let text = "";
      // Collect all lines until the next blank line
      let j = i + 1;
      while (j < lines.length && lines[j].trim() !== "") {
        text += lines[j] + " ";
        j++;
      }
      transcript.push({
        start: parseTime(start),
        end: parseTime(end),
        text: text.trim()
      });
    }
  }
  return transcript;
}

app.get("/api/get-transcript", async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: "Missing YouTube URL" });

  // Command to download auto-subtitles in VTT
  const cmd = `./yt-dlp --skip-download --write-auto-sub --sub-lang en --sub-format vtt -o "subs.%(ext)s" "${videoUrl}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp error:", error);
      return res.status(500).json({ error: "Failed to fetch transcript", details: stderr });
    }

    try {
      // Read the downloaded VTT file
      const files = fs.readdirSync("./").filter(f => f.endsWith(".vtt"));
      if (files.length === 0) return res.status(404).json({ error: "No captions found" });

      const vttText = fs.readFileSync(files[0], "utf-8");
      const transcript = parseVtt(vttText);

      // Clean up VTT file after parsing
      fs.unlinkSync(files[0]);

      res.json({ transcript });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to parse transcript", details: err.message });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
