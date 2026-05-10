const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🔥 Elina Backend läuft perfekt');
});

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend funktioniert 😎'
  });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});