/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 4/15/26
 * Description:
 *      Handles all account api functions.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const { MongoClient } = require("mongodb")
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;



// --------------------------- MONGODB FUNCTIONS --------------------------- //

async function isRegistered(payload) {
    const client = new MongoClient(process.env.MONGO_CONN);

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");

        const isRegistered = await users.find(payload);
        return (isRegistered) ? true: false;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function registerUser(payload) {
    const client = new MongoClient(process.env.MONGO_CONNECTION);

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");

        const result = await users.insertOne(payload);
        return (result) ? true: false;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}


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
    if (!isRegistered({"user": user})) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(pass, salt, function(err, hash) {
                registerUser({"user": user, "pass": hash});
            });
        });
    }
    console.error("Currently unable to manage account information.");
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;