import express from "express";
import dotenv from "dotenv";
import transcriptRoute from "./routes/transcriptRoute.js";
import proxyRoute from "./routes/proxyRoute.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/transcript", transcriptRoute);
app.use("/api/proxy", proxyRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
