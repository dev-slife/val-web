/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 3/29/26
 * Description:
 *      Handles all main API communication between the frontend, backend, and web app services.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

import * as vast from "./libs/vast/api/algebra.mjs";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import path from "path";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = path.dirname(__dirname);
const __public = path.join(__root, 'public');
const app = express();



// --------------------------- INITIALIZATION --------------------------- //

app.use(express.static(__public, {
    extensions: ['html']
}));

app.use(bodyParser.json());



// --------------------------- ROUTING --------------------------- //

app.get('/home', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'home.html'));
});

app.get('/about', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'about.html'));
});

app.get('/terms', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'terms.html'));
});

app.get('/privacy', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'privacy.html'));
});

app.get('/copyright', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'copyright.html'));
});



// --------------------------- RUNNING THE APP --------------------------- //

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    vast.solve("2x+3x-5");
});