/**
 * Author: dev.slife
 * Date Created: 4/16/26
 * Date Updated: 4/16/26
 * Description:
 *      Handles all MinIO communication.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const Minio = require('minio');
const express = require("express");
const router = express.Router();



// --------------------------- MINIO FUNCTIONS --------------------------- //

async function uploadPFP() {
    const client = new Minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_USER,
        secretKey: process.env.MINIO_PASS
    });

    try {
        // Figure out how to send an image to MinIO
        // If possible, find a way to keep track of or delete previous pfp images uploaded by a user to prevent data build up
    } catch (err) {
        console.log(err);
    }
}



// --------------------------- SERVER FUNCTIONS --------------------------- //

router.get('/pfp', (req, res) => {
    // Research and figure out how to retrieve image data with the backend
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;