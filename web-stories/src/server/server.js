const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/novels', (req,res) => {
    const data = req.body;
    console.log("Recieved novel:", data);
    res.json({message: "Novel recieved.", receivedData: data});
});

app.listen(5000, () => {
    console.log("Server running on port: 5000");
});