/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 3/31/26
 * Description:
 *      Handles all account api functions.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const express = require("express");
const router = express.Router();



// --------------------------- SERVER FUNCTIONS --------------------------- //

router.get('/login', (req, res) => {
    const {user, pass} = req.query;
    // verify correct username and password with db
    console.error("Currently unable to manage account information.");
});

router.get('/register', (req, res) => {
    const {user, pass} = req.query;
    // verify correct username and password with db
    console.error("Currently unable to manage account information.");
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;