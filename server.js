const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Item = require('./models/Item');

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('MongoDB Connected Successfully!');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('Database connection failed:', err.message);
});

app.get('/', (req, res) => {
    res.send("API is working fine!");
});

const User = require('./models/User');
const auth = require('./middleware/auth');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists with this email!" });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({
            message: "User registered successfully!",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password!" });
        }

        res.status(200).json({
            message: "Login successful!",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/auth/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/items', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newItem = new Item({
            title,
            description,
            authorId: req.user.id
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/items', auth, async (req, res) => {
    try {
        const items = await Item.find({ authorId: req.user.id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/items/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item not found!" });
        }

        if (item.authorId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You do not have permission to update this item!" });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/items/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Item not found!" });
        }

        if (item.authorId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You do not have permission to delete this item!" });
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item successfully deleted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});