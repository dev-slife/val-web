/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 5/27/26
 * Description:
 *      Handles all account api functions.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const { MongoClient } = require("mongodb")
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;



// --------------------------- HELPER FUNCTIONS --------------------------- //

async function ascii(code) {
    if (code % 2 == 0) {
        code = code % 127;
        // A - Z
        if (code >= 65 && code <= 90) {
            code += 32;
        }
        // a - z
        if (code >= 97 && code <= 122) {
            code = String.fromCharCode(code);
        }
    }
    return String(code);
}


async function hashChat(title="", tag=0) {
    let hash = "";
    for (let i = 0; i < title.length; i++) {
        hash += await ascii(title.charCodeAt(i) * 17);
    }
    return hash.concat("_$", String(tag));
}



// --------------------------- USER FUNCTIONS --------------------------- //

async function isRegistered(payload) {
    const client = new MongoClient(process.env.MONGO_CONN);
    let isRegistered = false;

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");

        const userData = await users.findOne(payload);
        if (userData) {
            isRegistered = true;
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        return isRegistered;
    }
}


async function registerUser(payload) {
    const client = new MongoClient(process.env.MONGO_CONN);
    let success = false;

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");

        const result = await users.insertOne(payload);
        if (result) {
            success = true;
        }
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        return success;
    }
}


async function grabHash(payload) {
    const client = new MongoClient(process.env.MONGO_CONN);
    let hash = "";

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");

        const result = await users.findOne(payload);
        hash = result.pass;
    } catch (err) {
        console.log(err);
    } finally {
        await client.close();
        return hash;
    }
}



// --------------------------- CHAT HISTORY --------------------------- //

async function saveChat(user, chat_title, msgs=[], nouns=[], verbs=[]) {
    const client = new MongoClient(process.env.MONGO_CONN);
    let success, status, msg;

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");
        const userData = await users.findOne({user: user});

        if (userData) {
            const histCount = (userData.hasOwnProperty("chat_hist")) ? Object.keys(userData.chat_hist).length: 0;
            const hash = await hashChat(chat_title, histCount);

            const result = await users.updateOne(
                {user: user},
                {
                    $set: {[`chat_hist.${hash}.title`]: chat_title},
                    $push: {
                        [`chat_hist.${hash}.messages`]: {$each: msgs},
                        [`chat_hist.${hash}.context.nouns`]: {$each: nouns},
                        [`chat_hist.${hash}.context.verbs`]: {$each: verbs}
                    }
                },
                {upsert: false}
            );

            if (result) {
                success = true;
                status = 200;
                msg = "Successfully saved chat history.";
            } else {
                success = false;
                status = 500;
                msg = "The server could not update the chat history.";
            }
        } else {
            success = false;
            status = 400;
            msg = "User could not be found."
        }
    } catch (err) {
        console.log(err);
        success = false;
        status = 500;
        msg = "The server ran into an unexpected error."
    } finally {
        await client.close();
        return {success, status, msg};
    }
}


async function clearChat(user) {
    const client = new MongoClient(process.env.MONGO_CONN);
    let success, status, msg;

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");
        const userData = await users.findOne({user: user});

        if (userData) {
            const result = await users.updateOne(
                {user: user},
                {$unset: {chat_hist: []}}
            );

            if (result) {
                success = true;
                status = 200;
                msg = "Successfully saved chat history.";
            } else {
                success = false;
                status = 500;
                msg = "The server could not clear the chat history.";
            }
        } else {
            success = false;
            status = 400;
            msg = "User could not be found."
        }
    } catch (err) {
        console.log(err);
        success = false;
        status = 500;
        msg = "The server ran into an unexpected error."
    } finally {
        await client.close();
        return {success, status, msg};
    }
}


async function pullChat(user) {
    const client = new MongoClient(process.env.MONGO_CONN);
    let success, status, msg, hist;

    try {
        await client.connect();
        const db = client.db("VAL_DATA");
        const users = db.collection("users");
        const userData = await users.findOne({user: user});

        if (userData) {
            if (userData.chat_hist) {
                success = true;
                status = 200;
                msg = "Successfully pulled user chat history."
                hist = userData.chat_hist;
            } else {
                sucess = false;
                status = 200;
                msg = "User has no chat history to pull."
            }
        } else {
            sucess = false;
            status = 400;
            msg = "User could not be found."
        }
    } catch (err) {
        console.log(err);
        success = false;
        status = 500;
        msg = "The server ran into an unexpected error."
    } finally {
        await client.close();
        return {success, status, msg, hist};
    }
}


async function pullChatContext(user, title) {
    const hist = await pullChat(user);
    
    if (hist) {
        const hash = await hashChat(title, hist.length);
    }
}



// --------------------------- SERVER FUNCTIONS --------------------------- //

router.post('/user/login', async(req, res) => {
    const {user, pass} = req.body;

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


router.post('/user/register', async(req, res) => {
    const {user, pass} = req.body;

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
                        "msg": "the server ran into an error when registering."
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


router.post('/user/save_chat', async(req, res) => {
    const data = req.body;
    let {success, status, msg} = await saveChat(data.user, data.title, data.msgs, data.nouns, data.verbs);

    res.status(status).send({
        "success": success,
        "msg": msg
    });
});


router.post('/user/clear_chat', async(req, res) => {
    const {user} = req.body;
    let {success, status, msg} = await clearChat(user);

    res.status(status).send({
        "success": success,
        "msg": msg
    });
});


router.get('/user/pull_chat', async(req, res) => {
    const {user} = req.query;
    let {success, status, msg, hist} = await pullChat(user);

    res.status(status).send({
        "success": success,
        "msg": msg,
        "hist": hist
    });
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = {
    router: router,
    saveChat: saveChat,
    pullChat: pullChat
}