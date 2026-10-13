/**
 * Author: dev.slife
 * Date Created: 10/12/26
 * Date Updated: 10/12/26
 * Description:
 *      Handles all routes to usernames.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const path = require("path");
const express = require("express");
const router = express.Router();
const dbUtils = require("../utils/data_utils.js");

const __public = (() => {
    let dir = __dirname
    for (let i = 0; i < 4; i++) {
        dir = path.dirname(dir);
    }
    return path.join(dir, 'public');
})();



// --------------------------- ROUTING FUNCTIONS --------------------------- //

router.get('/:user', async(req, res) => {
    const {user} = req.params;

    try {
        if (user) {
            if (await dbUtils.isRegistered(user)) {
                // res.status(200).send({
                //     success: true,
                //     message: `The user given was: ${user}`
                // });
                res.status(200).sendFile(path.join('pages', 'profile.html'), {root: __public});
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