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

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`MongoDB Atlas : connected`))
    .catch((err) => console.error(`MongoDB Atlas : not connected`, err));

// --- User Model ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- Novel Model (UPDATED) ---
const novelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    chapter: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // New: Store Author ID
    createdAt: { type: Date, default: Date.now }
});
const Novel = mongoose.model('Novel', novelSchema);

// --- Middleware: The Bouncer ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET || "mysecretkey", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created! Please login." });
    } catch (error) { res.status(500).json({ message: "Error registering user" }); }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "mysecretkey", { expiresIn: "1h" });

        // RETURN THE USER ID so the frontend knows who is logged in
        res.json({ token, username: user.username, userId: user._id });
    } catch (error) { res.status(500).json({ message: "Error logging in" }); }
});

// GET ALL NOVELS
app.get('/api/novels', async (req, res) => {
    try {
        // .populate('author') replaces the ID with the actual User object (username, etc.)
        const novels = await Novel.find().populate('author', 'username');
        res.json(novels);
    } catch (error) { res.status(500).json({ message: "Failed to fetch novels" }); }
});

// GET ONE NOVEL
app.get('/api/novels/:id', async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id);
        if (!novel) return res.status(404).json({ message: "Not found" });
        res.json(novel);
    } catch (error) { res.status(500).json({ message: "Error fetching novel" }); }
});

// CREATE NOVEL (Protected)
app.post('/api/novels', authenticateToken, async (req, res) => {
    const { title, chapter } = req.body;
    const newNovel = new Novel({
        title,
        chapter,
        author: req.user.id // SAVE THE AUTHOR ID
    });
    try {
        const savedNovel = await newNovel.save();
        res.status(201).json(savedNovel);
    } catch (error) { res.status(500).json({ message: "Failed to save novel." }); }
});

// DELETE NOVEL (Protected + Ownership Check)
app.delete('/api/novels/:id', authenticateToken, async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id);
        if (!novel) return res.status(404).json({ message: "Novel not found" });

        // CHECK OWNERSHIP
        if (novel.author && novel.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own novels!" });
        }

        await Novel.findByIdAndDelete(req.params.id);
        res.json({ message: "Novel deleted." });
    } catch (error) { res.status(500).json({ message: "Failed to delete novel" }); }
});

// UPDATE NOVEL (Protected + Ownership Check)
app.put('/api/novels/:id', authenticateToken, async (req, res) => {
    try {
        const novel = await Novel.findById(req.params.id);
        if (!novel) return res.status(404).json({ message: "Novel not found" });

        // CHECK OWNERSHIP
        if (novel.author && novel.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own novels!" });
        }

        novel.title = req.body.title;
        novel.chapter = req.body.chapter;
        const updatedNovel = await novel.save();
        res.json(updatedNovel);
    } catch (error) { res.status(500).json({ message: "Failed to update novel" }); }
});

app.listen(5000, () => {
    console.log("Server running on port: 5000");
});