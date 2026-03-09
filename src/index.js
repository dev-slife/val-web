const bodyParser = require('body-parser');

const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(bodyParser.json());

// API routes AFTER static
app.get('/api/test', (req, res) => res.json({ status: 'API works' }));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});