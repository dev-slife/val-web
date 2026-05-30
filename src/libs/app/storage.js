/**
 * Author: dev.slife
 * Date Created: 4/16/26
 * Date Updated: 5/29/26
 * Description:
 *      Handles all MinIO communication.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const minio = require('minio');
const multer = require('multer');
const express = require("express");
const router = express.Router();

const pfpBucket = "profiles";
const valBlob = "val-blob";
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
const minioEndpoint = () => {
    // env
    if (process.env.MINIO_ENDPOINT) {
        return process.env.MINIO_ENDPOINT;
    }

    // Windows
    if (process.env.NODE_ENV !== 'production' && process.platform === 'win32') {
        return 'host.docker.internal';
    }

    // Linux
    return '127.0.0.1';
};



// --------------------------- MINIO FUNCTIONS --------------------------- //


async function grabPFP(key) {
    const client = new minio.Client({
        endPoint: minioEndpoint(),
        port: 9000,
        useSSL: false,
        forcePathStyle: true,
        accessKey: process.env.MINIO_USER,
        secretKey: process.env.MINIO_PASS
    });

    try {
        const bucketFound = await client.bucketExists(pfpBucket);
        if (bucketFound) {
            const url = await client.presignedGetObject(
                pfpBucket, key, 60 * 5,
                {'response-content-disposition': 'inline'}
            );
            return url;
        } else {
            console.error(`${pfpBucket} does not exist as a storage bucket.`);
        }
    } catch (err) {
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            cause: err.cause
        });
        throw err;
    }
}


async function uploadPFP(key, file) {
    const client = new minio.Client({
        endPoint: minioEndpoint(),
        port: 9000,
        useSSL: false,
        forcePathStyle: true,
        accessKey: process.env.MINIO_USER,
        secretKey: process.env.MINIO_PASS
    });

    try {
        const bucketFound = await client.bucketExists(pfpBucket);
        if (!bucketFound) {
            await client.makeBucket(pfpBucket);
        }

        const result = await client.putObject(pfpBucket, key, file.buffer, {
            'Content-Type': file.mimetype
        });

        const url = await grabPFP(key);
        return url;
    } catch (err) {
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            cause: err.cause
        });
        throw err;
    }
}


async function getBlobItem(key) {
    const client = new minio.Client({
        endPoint: minioEndpoint(),
        port: 9000,
        useSSL: false,
        forcePathStyle: true,
        accessKey: process.env.MINIO_USER,
        secretKey: process.env.MINIO_PASS
    });

    try {
        const bucketFound = await client.bucketExists(valBlob);
        if (bucketFound) {
            const url = await client.presignedGetObject(
                valBlob, key, 10,
                {'response-content-disposition': 'inline'}
            );
            return url;
        } else {
            console.error(`${valBlob} does not exist as a storage bucket.`);
        }
    } catch (err) {
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            cause: err.cause
        });
        throw err;
    }
}



// --------------------------- ROUTING --------------------------- //
    
router.post('/pfp/upload', upload.single('pfp'), async(req, res) => {
    try {
        const user = req.body.user;
        const file = req.file;
        const key = `${user}.png`;

        if (!user) {
            res.status(400).send("No user was given.");
        }
        
        const url = await uploadPFP(key, file);
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
        const { user } = req.query;
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


router.get('/blob/pull', async(req, res) => {
    try {
        const { key } = req.query;

        if (!key) {
            res.status(400).send("No key was given.");
        }

        const url = await getBlobItem(key);

        res.status(200).send({
            "message": "Blob item successfully retrieved.",
            "url": url
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Could not retrieve Blob item.");
    }
});



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;
