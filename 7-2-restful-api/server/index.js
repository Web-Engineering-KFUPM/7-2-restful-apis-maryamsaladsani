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


// ===========================================
// PUT /api/songs/:id (Update a song)
// ===========================================
app.put("/api/songs/:id", async (req, res) => {
    try {
        const updated = await Song.findByIdAndUpdate(
            req.params.id,
            req.body || {},     // fields to update
            {
                new: true,        // return the updated document
                runValidators: true,
                context: "query", // required for validators to work properly
            }
        );

        if (!updated) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message || "Update failed" });
    }
});


// ===========================================
// DELETE /api/songs/:id (Delete a song)
// ===========================================
app.delete("/api/songs/:id", async (req, res) => {
    try {
        const deleted = await Song.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Song not found" });
        }

        res.status(204).end(); // No Content
    } catch (err) {
        res.status(400).json({ message: err.message || "Delete failed" });
    }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));



