import { exec } from "child_process";
import fs from "fs";
import path from "path";

const COOKIE_PATH = path.join(process.cwd(), "cookies", "youtube_cookies.txt");

export const fetchTranscript = (url) => {
  return new Promise((resolve, reject) => {
    const match = url.match(/v=([^&]+)/);
    const videoId = match ? match[1] : null;
    if (!videoId) return reject("Invalid YouTube URL");

    const cmd = `./yt-dlp --cookies ${COOKIE_PATH} --write-auto-sub --sub-lang en --skip-download -o "%(id)s.%(ext)s" ${url}`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(stderr || error.message);

      const vttFile = `${videoId}.en.vtt`;
      if (!fs.existsSync(vttFile)) return reject("No captions found");

      const content = fs.readFileSync(vttFile, "utf8");
      fs.unlinkSync(vttFile); // delete file after read
      resolve(content);
    });
  });
};
