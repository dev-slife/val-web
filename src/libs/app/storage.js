/**
 * Author: dev.slife
 * Date Created: 4/16/26
 * Date Updated: 4/30/26
 * Description:
 *      Handles all MinIO communication.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const minio = require('minio');
const express = require("express");
const router = express.Router();

const pfpBucket = "profiles";



// --------------------------- MINIO FUNCTIONS --------------------------- //

async function uploadPFP(key) {
    try {
        const client = new minio.Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: process.env.MINIO_USER,
            secretKey: process.env.MINIO_PASS
        });

        const bucketExists = await client.bucketExists(pfpBucket);
        if (!bucketExists) {
            await client.makeBucket(pfpBucket);
        }

        const url = await client.presignedPutObject(pfpBucket, key, 60 * 5);
        return url;
    } catch (err) {
        console.error(err);
    }
}


async function grabPFP(key) {
    try {
        const client = new minio.Client({
            endPoint: 'localhost',
            port: 9000,
            useSSL: false,
            accessKey: process.env.MINIO_USER,
            secretKey: process.env.MINIO_PASS
        });

        const bucketExists = await client.bucketExists(pfpBucket);
        if (bucketExists) {
            const url = await client.presignedGetObject(pfpBucket, key, 60 * 5);
            return url;
        } else {
            console.error(`${pfpBucket} does not exist as a storage bucket.`);
            return;
        }
    } catch (err) {
        console.error(err);
    }
}



// --------------------------- ROUTING --------------------------- //
    
router.get('/pfp/upload', async(req, res) => {
    try {
        const { user } = req.params;
        const key = `${user}.png`;

        if (!user) {
            res.status(400).send("No user was given.");
        }

        const url = await uploadPFP(key);

        res.status(200).send({
            "message": 'Profile picture uploaded successfully',
            "url": url
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not upload pfp.");
    }
});


router.get('/pfp/pull', async(req, res) => {
    try {
        const { user } = req.params;
        const key = `${user}.png`;

        if (!user) {
            res.status(400).send("No user was given.");
        }

        const url = await grabPFP(key);

        res.status(200).send({
            "message": 'Profile picture uploaded successfully',
            "url": url
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not retrieve pfp.");
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;