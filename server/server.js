const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Score = require('./models/Score');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
     .connect('mongodb://127.0.0.1:27017/snake_game')
     .then(() => {
        console.log("MongoDB connected");
     })
     .catch((error) => {
        console.log("MongoDb connection error:", error);
     });

app.get('/', (req,res) => {
    res.json({message: 'Snake Game is Running'});
});

app.get('/api/scores', async(req,res) => {
    try {
        const scores = await Score.find().sort({score: -1});

        res.json(scores);
    }catch(error) {
        res.status(500).json({
            message: "Error getting scores"
        });
    }
});

app.post("/api/scores", async(req,res) => {
    try{
        const { player, score } =req.body;

        const newScore = new Score({
            player,
            score
        });

        const savedScore = await newScore.save();

        res.status(201).json(savedScore);
    }catch(error){
        res.status(500).json({
            message: "Error saving score"
        });
    }
});

const PORT = 5000;

app.listen(PORT, ()=> {
    console.log(`Server is running on http: //localhost ${PORT}`);
}); 