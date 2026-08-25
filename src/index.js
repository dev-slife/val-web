/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 8/25/26
 * Description:
 *      Handles all of the main routing and communication for the entire web app.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const path = require("path");
const express = require("express");

const __root = path.dirname(__dirname);
const __public = path.join(__root, 'public');
const app = express();
const options = {
    index: path.join(__public, "pages", "home.html"),
    extensions: ['html']
}

const dbRouter = require("./libs/app/routes/db.js");
const amaRouter = require("./libs/app/routes/ama.js");
const storeRouter = require("./libs/app/routes/storage.js");



// --------------------------- INITIALIZATION --------------------------- //

// Mount app
app.use(express.static(__public, options));
app.use(express.json());

// Mount routers
app.use('/api/db', dbRouter);
app.use('/api/val', amaRouter);
app.use('/api/storage', storeRouter);



// --------------------------- ROUTING --------------------------- //

app.get('/', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'home.html'));
});

app.get('/resources', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'resources.html'));
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

app.get('/register', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'register.html'));
});

app.get('/login', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'login.html'));
});

app.get('/settings', (_, res) => {
    res.sendFile(path.join(__public, 'pages', 'settings.html'));
});



// --------------------------- RUNNING THE APP --------------------------- //

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`App listening on port ${PORT}`);
});