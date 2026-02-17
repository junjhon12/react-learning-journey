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

// --- USER MODEL ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- BOOK MODEL (The Jacket) ---
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.model('Book', bookSchema);

// --- CHAPTER MODEL (The Pages) ---
const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Link to the Book
    createdAt: { type: Date, default: Date.now }
});
const Chapter = mongoose.model('Chapter', chapterSchema);

// --- MIDDLEWARE ---
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

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created!" });
    } catch (error) { res.status(500).json({ message: "Error registering" }); }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "mysecretkey", { expiresIn: "1h" });
        res.json({ token, username: user.username, userId: user._id });
    } catch (error) { res.status(500).json({ message: "Error logging in" }); }
});

// --- BOOK ROUTES ---

// GET All Books (Library)
app.get('/api/books', async (req, res) => {
    const books = await Book.find().populate('author', 'username');
    res.json(books);
});

// GET One Book (Table of Contents)
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author', 'username');
        if (!book) return res.status(404).json({ message: "Book not found" });
        
        // Find all chapters that belong to this book
        const chapters = await Chapter.find({ book: book._id });
        
        res.json({ book, chapters }); // Send both!
    } catch (error) { res.status(500).json({ message: "Error fetching book" }); }
});

// CREATE Book (Jacket only)
app.post('/api/books', authenticateToken, async (req, res) => {
    try {
        const newBook = new Book({
            title: req.body.title,
            description: req.body.description,
            author: req.user.id
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) { res.status(500).json({ message: "Error creating book" }); }
});

// --- CHAPTER ROUTES ---

// READ One Chapter
app.get('/api/chapters/:id', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).populate('book');
        res.json(chapter);
    } catch (error) { res.status(500).json({ message: "Error fetching chapter" }); }
});

// CREATE Chapter (Inside a Book)
app.post('/api/books/:bookId/chapters', authenticateToken, async (req, res) => {
    try {
        // Optional: Check if book exists and user owns it first (omitted for brevity)
        const newChapter = new Chapter({
            title: req.body.title,
            content: req.body.content,
            book: req.params.bookId 
        });
        await newChapter.save();
        res.status(201).json(newChapter);
    } catch (error) { res.status(500).json({ message: "Error creating chapter" }); }
});

// --- CHAPTER MANAGEMENT ---

// UPDATE Chapter
app.put('/api/chapters/:id', authenticateToken, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).populate('book');
        if (!chapter) return res.status(404).json({ message: "Chapter not found" });

        // Check Ownership via the Book
        if (chapter.book.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only edit your own chapters!" });
        }

        chapter.title = req.body.title;
        chapter.content = req.body.content;
        await chapter.save();
        res.json(chapter);
    } catch (error) { res.status(500).json({ message: "Error updating chapter" }); }
});

// DELETE Chapter
app.delete('/api/chapters/:id', authenticateToken, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).populate('book');
        if (!chapter) return res.status(404).json({ message: "Chapter not found" });

        // Check Ownership via the Book
        if (chapter.book.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own chapters!" });
        }

        await Chapter.findByIdAndDelete(req.params.id);
        res.json({ message: "Chapter deleted" });
    } catch (error) { res.status(500).json({ message: "Error deleting chapter" }); }
});

app.listen(5000, () => console.log("Server running on port 5000"));