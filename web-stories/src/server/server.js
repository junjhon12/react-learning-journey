import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import rateLimit from 'express-rate-limit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: 'https://your-app-name.vercel.app' 
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`MongoDB Atlas : connected`))
    .catch((err) => console.error(`MongoDB Atlas : not connected`, err));

// --- USER MODEL ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    savedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] // <--- ADD THIS
});
const User = mongoose.model('User', userSchema);

// --- BOOK MODEL (The Jacket) ---
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    views: { type: Number, default: 0 }, // <--- ADD THIS
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

// --- COMMENT MODEL ---
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', commentSchema);
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login attempts per window
    message: { message: "Too many login attempts, please try again after 15 minutes." }
});

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

// GET All Books (with optional Author filter)
app.get('/api/books', async (req, res) => {
    try {
        const { author } = req.query; // Look for ?author=ID in the URL

        // If author exists, filter by it. If not, get all.
        const filter = author ? { author } : {}; 

        const books = await Book.find(filter).populate('author', 'username');
        res.json(books);
    } catch (error) { res.status(500).json({ message: "Error fetching books" }); }
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

// --- COMMENT ROUTES ---

// GET Comments for a specific Chapter
app.get('/api/chapters/:chapterId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ chapter: req.params.chapterId })
            .populate('author', 'username') // Get the username, not just the ID
            .sort({ createdAt: -1 }); // Newest comments first
        res.json(comments);
    } catch (error) { res.status(500).json({ message: "Error fetching comments" }); }
});

// POST a new Comment (Auth Required)
app.post('/api/chapters/:chapterId/comments', authenticateToken, async (req, res) => {
    try {
        const newComment = new Comment({
            content: req.body.content,
            author: req.user.id,
            chapter: req.params.chapterId
        });
        await newComment.save();

        // Populate the author so we can display the username immediately
        const populatedComment = await newComment.populate('author', 'username');
        res.status(201).json(populatedComment);
    } catch (error) { res.status(500).json({ message: "Error posting comment" }); }
});

// DELETE a Comment (Only the author can delete)
app.delete('/api/comments/:id', authenticateToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        // Check if the user trying to delete is the author
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own comments!" });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: "Comment deleted" });
    } catch (error) { res.status(500).json({ message: "Error deleting comment" }); }
});

// GET Public User Profile
app.get('/api/users/:id', async (req, res) => {
    try {
        // Find user but DO NOT return the password
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) { res.status(500).json({ message: "Error fetching user" }); }
});

// --- BOOKSHELF ROUTES ---

// Toggle Save/Unsave Book
app.post('/api/books/:id/save', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const bookId = req.params.id;

        // Check if book is already saved
        if (user.savedBooks.includes(bookId)) {
            user.savedBooks.pull(bookId); // Remove it
            await user.save();
            res.json({ message: "Book removed from shelf", isSaved: false });
        } else {
            user.savedBooks.push(bookId); // Add it
            await user.save();
            res.json({ message: "Book added to shelf", isSaved: true });
        }
    } catch (error) { res.status(500).json({ message: "Error updating bookshelf" }); }
});

// Get My Bookshelf
app.get('/api/bookshelf', authenticateToken, async (req, res) => {
    try {
        // Find the user and ONLY get their savedBooks (populated with details)
        const user = await User.findById(req.user.id).populate({
            path: 'savedBooks',
            populate: { path: 'author', select: 'username' } // Nested populate to get author names too
        });
        res.json(user.savedBooks);
    } catch (error) { res.status(500).json({ message: "Error fetching bookshelf" }); }
});

// Increment Book Views
app.post('/api/books/:id/view', async (req, res) => {
    try {
        // Use $inc: { views: 1 } to add exactly one
        await Book.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
        res.json({ message: "View counted" });
    } catch (error) { res.status(500).json({ message: "Error" }); }
});

// --- AI CRITIQUE ASSISTANT ---
app.post('/api/ai/critique', authenticateToken, async (req, res) => {
    const { content, bookTitle } = req.body;

    if (!content || content.length < 100) {
        return res.status(400).json({ message: "Write at least 100 characters for a quality review!" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a professional narrative editor. Analyze this chapter for a book titled "${bookTitle}".
            
            STRICT RULES:
            - DO NOT rewrite or write any content for the user.
            - Provide feedback, tips, and suggestions ONLY.
            - Return the response as a JSON object.

            ANALYSIS CRITERIA:
            1. Grade (A through F) for each: Structure, Goal/Objective, Character Development/Motivation, Details/Setting, Dynamic Pacing, Connective Tissue, Resolution/Cliffhanger.
            2. List any specific plot-holes or inconsistencies regarding story elements.
            3. Provide 3 specific "Tips for Growth".

            Return ONLY this JSON format:
            {
              "grades": {
                "structure": "Grade",
                "goal": "Grade",
                "characters": "Grade",
                "details": "Grade",
                "pacing": "Grade",
                "connective": "Grade",
                "resolution": "Grade"
              },
              "plotHoles": ["string"],
              "tips": ["string"]
            }

            CHAPTER CONTENT:
            ${content.replace(/<[^>]*>?/gm, '')} 
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Extract JSON from the AI response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            res.json(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error("Invalid AI format");
        }
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "The assistant is currently unavailable." });
    }
});

app.use('/api/auth/login', loginLimiter);

app.listen(5000, () => console.log("Server running on port 5000"));