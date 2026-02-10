require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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

app.listen(5000, () => {
    console.log("Server running on port: 5000");
});