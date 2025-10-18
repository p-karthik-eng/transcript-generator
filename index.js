import express from "express";
import dotenv from "dotenv";
import getTranscriptRoute from "./routes/getTranscriptRoute.js";

dotenv.config();
const app = express();
app.use(express.json());

// Register the GET route
app.use("/api/get-transcript", getTranscriptRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
