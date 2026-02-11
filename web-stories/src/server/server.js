import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`MongoDB Atlas : connected`))
    .catch((err) => console.error(`MongoDB Atlas : not connected`, err));

const novelSchema = new mongoose.Schema({
    title: {type: String, required: true},
    chapter: {type:String, required:true},
    createdAt: {type: Date, default: Date.now}
});

const Novel =mongoose.model(`Novel`, novelSchema);

app.post('/api/novels', async(req,res) => {
    const {title, chapter} = req.body;
    const newNovel = new Novel({
        title,
        chapter
    });
    try {
        const savedNovel = await newNovel.save();
        console.log(`Novel saved to DB:`, savedNovel);
        res.status(201).json({
            message: `${title} saved successfully.`,
            novel: savedNovel
        });
    } catch (error) {
        console.error("Error saving novel:", error);
        res.status(500).json({message: "Failed to save novel."});
    }
});

app.get('/api/novels', async (req, res) => {
    try {
        const novels = await Novel.find();
        console.log("Fetching novels...");
        res.json(novels);
    } catch (error) {
        console.error("Error fetching novel:", error);
        res.status(500).json({message: "Failed to fetch novel."});
    }
})

app.delete('/api/novels/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from the URL URL

    try {
        const deletedNovel = await Novel.findByIdAndDelete(id);
        
        if (!deletedNovel) {
            return res.status(404).json({ message: "Novel not found" });
        }

        console.log(`Deleted novel: ${deletedNovel.title}`);
        res.json({ message: "Novel deleted." });
    } catch (error) {
        console.error("Error deleting novel:", error);
        res.status(500).json({ message: "Failed to delete novel" });
    }
});

app.put('/api/novels/:id', async (req, res) => {
    const { id } = req.params;
    const { title, chapter } = req.body;

    try {
        // Find the novel by ID and update it
        // { new: true } tells Mongoose to return the UPDATED version, not the old one
        const updatedNovel = await Novel.findByIdAndUpdate(
            id, 
            { title, chapter }, 
            { new: true }
        );

        if (!updatedNovel) {
            return res.status(404).json({ message: "Novel not found" });
        }

        console.log("Updated novel:", updatedNovel.title);
        res.json(updatedNovel);
    } catch (error) {
        console.error("Error updating novel:", error);
        res.status(500).json({ message: "Failed to update novel" });
    }
});

// GET Single Route: Fetch just one novel by ID
app.get('/api/novels/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const novel = await Novel.findById(id);
        if (!novel) {
            return res.status(404).json({ message: "Novel not found" });
        }
        res.json(novel);
    } catch (error) {
        console.error("Error fetching novel:", error);
        res.status(500).json({ message: "Failed to fetch novel" });
    }
});

// GET Single Novel by ID
app.get('/api/novels/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const novel = await Novel.findById(id);
        if (!novel) {
            return res.status(404).json({ message: "Novel not found" });
        }
        res.json(novel);
    } catch (error) {
        console.error("Error fetching novel:", error);
        res.status(500).json({ message: "Failed to fetch novel" });
    }
});

app.listen(5000, () => {
    console.log("Server running on port: 5000");
});