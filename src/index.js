/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 3/31/26
 * Description:
 *      Handles all main API communication between the frontend, backend, and web app services.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const { fileURLToPath } = require("url");
const path = require("path");
const express = require("express");

const __root = path.dirname(__dirname);
const __public = path.join(__root, 'public');
const app = express();
const options = {
    index: path.join(__public, "pages", "home.html"),
    extensions: ['html']
}

const credRouter = require("./libs/app/credentials");
const vastRouter = require("./libs/vast/api/algebra");



// --------------------------- INITIALIZATION --------------------------- //

// Mount app
app.use(express.static(__public, options));
app.use(express.json());

// Mount routers
app.use('/api/credentials', credRouter);
app.use('/api/vast', vastRouter);



// --------------------------- ROUTING --------------------------- //

app.get('/', (_, res) => {
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
});