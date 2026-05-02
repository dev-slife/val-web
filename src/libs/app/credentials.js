/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 5/2/26
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

        const isRegistered = await users.find(payload).toArray();
        return (isRegistered.length != 0) ? true: false;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}

async function registerUser(payload) {
    const client = new MongoClient(process.env.MONGO_CONN);

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

async function grabHash(payload) {
    const client = new MongoClient(process.env.MONGO_CONN);

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");

        const result = await users.find(payload).toArray();
        return result[0]["pass"]
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
    }
}



// --------------------------- SERVER FUNCTIONS --------------------------- //

router.get('/login', async(req, res) => {
    const {user, pass} = req.query;

    if (await isRegistered({"user": user})) {
        const hash = await grabHash({"user": user});
    
        await bcrypt.compare(pass, hash, async function(err, result) {
            if (result) {
                res.status(200).send({
                    "success": true,
                    "registered": true,
                    "user": user,
                    "msg": "sucessfully logged in"
                });
            } else {
                res.status(400).send({
                    "success": false,
                    "registered": true,
                    "user": user,
                    "msg": "incorrect password"
                });
            }
        });
    } else {
        res.status(400).send({
            "success": false,
            "registered": false,
            "user": user,
            "msg": "user is not registered"
        });
    }
});

router.get('/register', async(req, res) => {
    const {user, pass} = req.query;

    if (!await isRegistered({"user": user})) {
        await bcrypt.genSalt(saltRounds, async function(err, salt) {
            await bcrypt.hash(pass, salt, async function(err, hash) {
                const success = await registerUser({"user": user, "pass": hash});
                if (success) {
                    res.status(200).send({
                        "success": true,
                        "registered": true,
                        "user": user,
                        "msg": "user successfully registered."
                    })
                } else {
                    res.status(500).send({
                        "success": false,
                        "registered": false,
                        "user": user,
                        "msg": "server ran into an error when registering."
                    })
                }
            });
        });
    } else {
       res.status(400).send({
            "success": false,
            "registered": true,
            "user": user,
            "msg": "user is already registered."
        }) 
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;