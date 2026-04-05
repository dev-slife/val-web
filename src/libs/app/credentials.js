/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 4/4/26
 * Description:
 *      Handles all account api functions.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;



// --------------------------- SERVER FUNCTIONS --------------------------- //

router.get('/login', (req, res) => {
    const {user, pass} = req.query;
    // verify correct username and password with db
    const hash = ""; // grab from MongoDB
    bcrypt.compare(pass, hash, function(err, result) {
        if (result) {
            // load profile
            res.send({
                user: user,
                success: true
            });
        } else {
            res.send({
                user: user,
                success: false
            });
        }
    });
    console.error("Currently unable to manage account information.");
});

router.get('/register', (req, res) => {
    const {user, pass} = req.query;
    // make sure the current username is not taken
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(pass, salt, function(err, hash) {
            // store hash in MongoDB
        });
    });
    console.error("Currently unable to manage account information.");
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;