import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());

await connectDB(process.env.MONGO_URL);


// ===========================================
// GET /api/songs (Read all songs)
// ===========================================
app.get("/api/songs", async (_req, res) => {
    try {
        const rows = await Song.find().sort({ createdAt: -1 }); // newest first
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ===========================================
// GET /api/songs/:id (Read one song by ID)
// ===========================================
app.get("/api/songs/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.json(song);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// api/songs (Insert song)
// ===============================
// POST /api/songs (Create new song)
// ===============================
app.post("/api/songs", async (req, res) => {
    try {
        const { title = "", artist = "", year } = req.body || {};

        // Insert song into DB
        const created = await Song.create({
            title: title.trim(),
            artist: artist.trim(),
            year
        });

        res.status(201).json(created); // success response
    } catch (err) {
        res.status(400).json({ message: err.message || "Create failed" });
    }
});

// /api/songs/:id (Update song)


// /api/songs/:id (Delete song)

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));



