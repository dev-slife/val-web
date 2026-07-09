/**
 * Author: dev.slife
 * Date Created: 4/16/26
 * Date Updated: 6/5/26
 * Description:
 *      Handles all object storage API calls.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const multer = require('multer');
const express = require("express");
const router = express.Router();
const storageUtil = require("../utils/file_utils.js");
const {BucketDNE} = require("../errors.js");

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {fileSize: 10 * 1024 * 1024} // 10MB
});



// --------------------------- ROUTING FUNCTIONS --------------------------- //
    
router.post('/pfp/upload', upload.single('pfp'), async(req, res) => {
    const user = req.body.user;
    const file = req.file;
    const key = `${user}.png`;

    try {
        if (user && file) {
            const url = await storageUtil.addPFP(key, file);
            if (url) {
                res.status(200).send({
                    success: true,
                    message: "Profile picture uploaded successfully.",
                    url: url
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: "The server ran into an unexpected error when attempting to upload the given profile picture."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete body given, missing username and/or file."
            });
        }
    } catch(err) {
        console.error(`Could not upload profile picture for ${user}`, {
            name: err.name,
            message: err.message,
            stack: err.stack
        });

        res.status(500).send({
            success: false,
            message: `The server ran into an unexpected error when attempting to upload the given profile picture, caught ${err.name}.`
        });
    }
});


router.get('/pfp/pull', async(req, res) => {
    const {user} = req.query;
    const key = `${user}.png`;

    try {
        if (user) {
            const url = await storageUtil.getPFP(key);
            if (url) {
                res.status(200).send({
                    success: true,
                    message: "Profile picture successfully pulled.",
                    url: url
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: "The server ran into an unexpected error when pulling the user's profile picture."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete query, missing '?user='."
            });
        }
    } catch (err) {
        const msg = (err instanceof BucketDNE) ?
            "The bucket for storing profile pictures does not exist.":
            `The server ran into an unexpected error when pulling the user's profile picture, caught ${err.name}`;

        console.error(`Could not grab profile picture of ${user}`, {
            name: err.name,
            message: err.message,
            stack: err.stack
        });

        res.status(500).send({
            success: false,
            message: msg
        });
    }
});


router.get('/blob/pull', async(req, res) => {
    const {key} = req.query;

    try {
        if (key) {
            const url = await storageUtil.getBlobItem(key);
            if (url) {
                res.status(200).send({
                    success: true,
                    message: "Blob item successfully retrieved.",
                    url: url
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: "The server ran into an unexpected error when pulling the requested blob item."
                })
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete query, missing `?key=`."
            });
        }
    } catch (err) {
        const msg = (err instanceof BucketDNE) ?
            "The bucket for storing server blob items does not exist.":
            `The server ran into an unexpected error when pulling the requested blob item, caught ${err.name}`;

        console.error(`Could not grab requested blob item with the key: ${key}`, {
            name: err.name,
            message: err.message,
            stack: err.stack
        });

        res.status(500).send({
            success: false,
            message: msg
        });
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;