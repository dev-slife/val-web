/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 5/2/26
 * Description:
 *      Handles all main API communication between the frontend, backend, and web app services.
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

const credRouter = require("./libs/app/credentials");
const vastRouter = require("./libs/app/vast");
const storeRouter = require("./libs/app/storage");
const msgGen = require("./libs/app/slm.js");
const algebra = require("./libs/vast/api/algebra.js");



// --------------------------- INITIALIZATION --------------------------- //

// Mount app
app.use(express.static(__public, options));
app.use(express.json());

// Mount routers
app.use('/api/credentials', credRouter);
app.use('/api/vast', vastRouter);
app.use('/api/storage', storeRouter);



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
    console.log("Matches Schema: " + JSON.stringify(msgGen.validatePrompts()));

    // try {
    //     const model = new msgGen.SLM();
    //     const question = "Hey VAL, could you help me simplify this: 5x-3x+2";
    //     const eq = msgGen.analyzeMsg(question)["equation"];
    //     console.log("Equation: ", eq);
    //     const answer = await algebra.solve(eq);
    //     console.log("TutorLog: ", answer["log"]);
    //     const result = model.ask(question, answer["log"]);
    //     console.log("Randomly Generated Message(s):");
    //     console.log(result);
    // } catch (err) {
    //     console.error(err);
    // }
});