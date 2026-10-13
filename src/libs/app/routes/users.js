/**
 * Author: dev.slife
 * Date Created: 10/12/26
 * Date Updated: 10/13/26
 * Description:
 *      Handles all routes to usernames.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const path = require("path");
const express = require("express");
const router = express.Router();

const dbUtils = require("../utils/data_utils.js");
const storageUtil = require("../utils/file_utils.js");
const {BucketDNE} = require("../errors.js");

const __public = (() => {
    let dir = __dirname
    for (let i = 0; i < 4; i++) {
        dir = path.dirname(dir);
    }
    return path.join(dir, 'public');
})();



// --------------------------- HELPER FUNCTIONS --------------------------- //

async function grabProfile(key) {
    try {
        return await storageUtil.getPFP(key);
    } catch (err) {
        if (err instanceof BucketDNE) {
            return await storageUtil.getBlobItem("default_pfp.png");
        }
    }
};

async function grabBio(user) {
    try {
        const config = await dbUtils.userConfig(user);
        if (config) {
            return config.bio;
        }
    } catch (err) {
        return "";
    }
};



// --------------------------- ROUTING FUNCTIONS --------------------------- //

router.get('/:user', async(req, res) => {
    const {user} = req.params;

    try {
        if (user) {
            if (await dbUtils.isRegistered(user)) {
                const key = `${user}.png`;
                const image = await grabProfile(key);
                const bio = await grabBio(user);

                res.status(200).sendFile(
                    path.join('pages', 'profile.html'),
                    {
                        root: __public,
                        headers: {
                            "Username": encodeURIComponent(user),
                            "User-Image": encodeURIComponent(image),
                            "User-Bio": encodeURIComponent(bio)
                        }
                    }
                );
            } else {
                res.status(400).send({
                    success: false,
                    message: "User is not registered."
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Incomplete params given, missing user."
            });
        }
    } catch(err) {
        console.error(`Could not retrieve profile for ${user}`, {
            name: err.name,
            message: err.message,
            stack: err.stack
        });

        res.status(500).send({
            success: false,
            message: `The server ran into an unexpected error when attempting to retrieve the profile for ${user}, caught ${err.name}.`
        });
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;