import * as vast from "./libs/vast/api/algebra.mjs";

import bodyParser from "body-parser";

import { fileURLToPath } from 'url';
import path from "path";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();


app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(bodyParser.json());

// API routes AFTER static
app.get('/api/test', (req, res) => res.json({ status: 'API works' }));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    vast.solve("2x+3x-5");
});