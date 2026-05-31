/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 5/30/26
 * Description:
 *      Handles all database API calls.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const dbUtils = require("../utils/data_utils.js");
const {UserDNE} = require("../errors.js");
const SALT_ROUNDS = 10;



// --------------------------- HELPER FUNCTIONS --------------------------- //

function validQuery(dataType, ...values) {
    for (const value of values) {
        if (value === null || value === undefined || typeof value !== dataType) {
            return false;
        }
    }
    return true;
}



// --------------------------- ROUTING FUNCTIONS --------------------------- //

router.post('/user/login', async(req, res) => {
    const {user, pass} = req.body;

    try {
        if (validQuery("string", user, pass)) {
            if (await dbUtils.isRegistered(user)) {
                const hash = await dbUtils.userSecret(user);
            
                await bcrypt.compare(pass, hash, async function(err, result) {
                    if (result) {
                        res.status(200).send({
                            success: true,
                            registered: true,
                            user: user,
                            message: "Sucessfully logged in"
                        });
                    } else {
                        res.status(200).send({
                            success: false,
                            registered: true,
                            user: user,
                            message: "Incorrect password given."
                        });
                    }
                });
            } else {
                res.status(200).send({
                    success: false,
                    registered: false,
                    user: user,
                    message: "User is not registered."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                user: user,
                message: "Incomplete body given, missing username and/or password."
            });
        }
    } catch (err) {
        console.error(`Server error on login for user: ${user}`, {
            name: err.name,
            message: err.message
        });

        res.status(500).send({
            success: false,
            user: user,
            message: `The server ran into an unexpected error when trying to log you in, caught: ${err.name}.`
        });
    }
});


router.post('/user/register', async(req, res) => {
    const {user, pass} = req.body;

    try {
        if (validQuery("string", user, pass)) {
            if (!await dbUtils.isRegistered(user)) {
                await bcrypt.genSalt(SALT_ROUNDS, async function(err, salt) {
                    await bcrypt.hash(pass, salt, async function(err, hash) {
                        const success = await dbUtils.initUser(user, hash);
                        if (success) {
                            res.status(200).send({
                                success: true,
                                registered: true,
                                user: user,
                                message: "User successfully registered."
                            });
                        } else {
                            res.status(500).send({
                                success: false,
                                registered: false,
                                user: user,
                                message: "The server ran into an unexpected error when registering."
                            });
                        }
                    });
                });
            } else {
               res.status(200).send({
                    success: false,
                    registered: true,
                    user: user,
                    message: "User is already registered."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                user: user,
                message: "Incomplete body given, missing username and/or password."
            });
        }
    } catch (err) {
        console.error(`Server error on registration of user: ${user}`, {
            name: err.name,
            message: err.message
        });

        res.status(500).send({
            success: false,
            user: user,
            message: `The server ran into an unexpected error when trying to register ${user}, caught: ${err.name}.`
        });
    }
});


router.post('/user/save_chat', async(req, res) => {
    const {user, title, msgs, nouns, verbs} = req.body;

    try {
        if (validQuery("string", user, title)) {
            const convoID = await dbUtils.saveChat(user, title, msgs, nouns, verbs);
            if (convoID) {
                res.status(200).send({
                    success: true,
                    message: "Chat history was successfully saved."
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: `The server ran into an unexpected error when trying to save ${title} chat history for ${user}.`
                })
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete body given, missing user and/or chat title."
            });
        }
    } catch(err) {
        if (err instanceof UserDNE) {
            res.status(200).send({
                success: false,
                message: `${user} is not a registered user.`
            });
        } else {
            console.error(`Server error on saving ${title} chat history of user: ${user}`, {
                name: err.name,
                message: err.message
            });
    
            res.status(500).send({
                success: false,
                message: `The server ran into an unexpected error when trying to save ${title} chat history for ${user}, caught: ${err.name}.`
            });
        }
    }
});


router.post('/user/clear_chat', async(req, res) => {
    const {user} = req.body;

    try {
        if (validQuery("string", user)) {
            if (await dbUtils.clearChat(user)) {
                res.status(200).send({
                    success: true,
                    message: "Successfully cleared chat history."
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: "User has no chat history to clear."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete body given, missing user."
            });
        }
    } catch(err) {
        if (err instanceof UserDNE) {
            res.status(200).send({
                success: false,
                message: `${user} is not a registered user.`
            });
        } else {
            console.error(`Server error on clearing the chat history of user: ${user}`, {
                name: err.name,
                message: err.message
            });
    
            res.status(500).send({
                success: false,
                message: `The server ran into an unexpected error when trying to clear the chat history for ${user}, caught: ${err.name}.`
            });
        }
    }
});


router.get('/user/pull_chat', async(req, res) => {
    const {user} = req.query;

    try {
        if (validQuery("string", user)) {
            const hist = await dbUtils.pullChat(user);
            if (hist) {
                res.status(200).send({
                    success: true,
                    message: "Successfully pulled chat history.",
                    hist: hist
                });
            } else {
                res.status(200).send({
                    success: false,
                    message: "Could not pull chat history."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete body given, missing user."
            });
        }
    } catch(err) {
        if (err instanceof UserDNE) {
            res.status(200).send({
                success: false,
                message: `${user} is not a registered user.`
            });
        } else {
            console.error(`Server error on grabbing the chat history of user: ${user}`, {
                name: err.name,
                message: err.message
            });
    
            res.status(500).send({
                success: false,
                message: `The server ran into an unexpected error when trying to grab the chat history for ${user}, caught: ${err.name}.`
            });
        }
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;