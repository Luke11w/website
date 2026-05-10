const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB verbinden
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('🔥 Connected to MongoDB');
})
.catch((error) => {
  console.log('❌ MongoDB Fehler:', error);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.send('🔥 Elina Backend läuft perfekt');
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funktioniert 😎'
  });
});

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Bitte alles ausfüllen'
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email bereits verwendet'
      });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    console.log('🔥 Neuer User gespeichert:', username);

    res.json({
      success: true,
      username,
      message: 'Account erstellt 😎'
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Fehler'
    });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Falsche Login Daten'
      });
    }

    res.json({
      success: true,
      username: user.username,
      message: 'Login erfolgreich 🔥'
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Server Fehler'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});