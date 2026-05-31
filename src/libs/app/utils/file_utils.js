/**
 * Author: dev.slife
 * Date Created: 4/16/26
 * Date Updated: 5/30/26
 * Description:
 *      Utility functions to use for object storage.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const minio = require('minio');
const {BucketDNE} = require("../errors.js");
const PFP_BUCKET = "profiles";
const VAL_BLOB = "val-blob";

const endpoint = () => {
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



// --------------------------- HELPER FUNCTIONS --------------------------- //

async function dump(bucket, key, lifetime=(60*5)) {
    const client = new minio.Client({
        endPoint: endpoint(),
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_USER,
        secretKey: process.env.MINIO_PASS
    });

    if (await client.bucketExists(bucket)) {
        return await client.presignedGetObject(
            bucket, key, lifetime,
            {'response-content-disposition': 'inline'}
        );
    } else {
        throw new BucketDNE(`${bucket} does not exist as a storage bucket.`);
    }
}


async function fill(bucket, key, file) {
    const client = new minio.Client({
        endPoint: endpoint(),
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_USER,
        secretKey: process.env.MINIO_PASS
    });

    const bucketFound = await client.bucketExists(bucket);
    if (!bucketFound) {
        await client.makeBucket(bucket);
    }

    await client.putObject(bucket, key, file.buffer, {
        'Content-Type': file.mimetype
    });

    return await dump(bucket, key);
}



// --------------------------- IMAGE FUNCTIONS --------------------------- //

async function getPFP(key) {
    return await dump(PFP_BUCKET, key);
}


async function addPFP(key, file) {
    return await fill(PFP_BUCKET, key, file);
}


async function getBlobItem(key) {
    return await dump(VAL_BLOB, key, 10);
}



// --------------------------- EXPORT FUNCTIONS --------------------------- //

module.exports = {
    getPFP: getPFP,
    addPFP: addPFP,
    getBlobItem: getBlobItem
};
