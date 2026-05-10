const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Benutzer Speicher
const users = [];

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
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Bitte alles ausfüllen'
    });
  }

  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email bereits verwendet'
    });
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password
  };

  users.push(newUser);

  console.log('Neuer User:', newUser);

  res.json({
    success: true,
    username,
    message: 'Account erstellt 🔥'
  });
});

// LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Falsche Login Daten'
    });
  }

  res.json({
    success: true,
    username: user.username,
    message: 'Login erfolgreich 😎'
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});