/**
 * Author: dev.slife
 * Date Created: 4/16/26
 * Date Updated: 7/9/26
 * Description:
 *      Utility functions to use for object storage.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const minio = require('minio');
const {BucketDNE} = require("../errors.js");
const PFP_BUCKET = "profiles";
const VAL_BLOB = "val-blob";

const internalEndpoint = () => {
    return process.env.MINIO_INTERNAL_ENDPOINT || "minio"
};

const publicEndpoint = () => {
    // env
    if (process.env.MINIO_PUBLIC_ENDPOINT) {
        return process.env.MINIO_PUBLIC_ENDPOINT;
    }

    // Windows
    if (process.env.NODE_ENV !== 'production' && process.platform === 'win32') {
        return 'host.docker.internal';
    }

    // Linux
    return '127.0.0.1';
};

const internalClient = new minio.Client({
    endPoint: internalEndpoint(),
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_USER,
    secretKey: process.env.MINIO_PASS,
    region: "us-east-1"
});

const publicClient = new minio.Client({
    endPoint: publicEndpoint(),
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_USER,
    secretKey: process.env.MINIO_PASS,
    region: "us-east-1"
});



// --------------------------- HELPER FUNCTIONS --------------------------- //

async function dump(bucket, key, lifetime=(60*5)) {
    if (await internalClient.bucketExists(bucket)) {
        return await publicClient.presignedGetObject(
            bucket, key, lifetime,
            {'response-content-disposition': 'inline'}
        );
    } else {
        throw new BucketDNE(`${bucket} does not exist as a storage bucket.`);
    }
}


async function fill(bucket, key, file) {
    const bucketFound = await internalClient.bucketExists(bucket);
    if (!bucketFound) {
        await internalClient.makeBucket(bucket);
    }

    await internalClient.putObject(bucket, key, file.buffer, {
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
