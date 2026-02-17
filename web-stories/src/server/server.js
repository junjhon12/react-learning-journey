import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();

app.use(cors());
app.use(express.json());

// 1. REGISTER (Create new user)
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password (encrypt it)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created! Please login." });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    }
});

// 2. LOGIN (Get Token)
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create Token (The "ID Card")
        // 'SECRET_KEY' should ideally be in .env, but we'll use a string for now
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "mysecretkey", { expiresIn: "1h" });

        res.json({ token, username: user.username });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`MongoDB Atlas : connected`))
    .catch((err) => console.error(`MongoDB Atlas : not connected`, err));

const novelSchema = new mongoose.Schema({
    title: {type: String, required: true},
    chapter: {type:String, required:true},
    createdAt: {type: Date, default: Date.now}
});

const Novel =mongoose.model(`Novel`, novelSchema);

// --- User Model ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

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