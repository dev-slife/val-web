/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 8/11/26
 * Description:
 *      Utility functions to use for database management.
 */



// ---------------------- IMPORTS & CONSTANTS ---------------------- //

const path = require("path");
const {MongoClient} = require("mongodb");
const {UserDNE} = require("../errors.js");

const DB = "VAL_DATA";
const VAL_JSON = path.join(__dirname, "..", "..", "..", "json");
const VAL_CONFIG = require(path.join(VAL_JSON, "user_config.json"));



// --------------------------- HELPER FUNCTIONS --------------------------- //

function exists(value) {
    return (value !== undefined && value !== null);
}


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


// READ OPERATIONS ONLY
async function whoIsUser(user) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();
    
    const db = client.db(DB);
    const users = db.collection("users");
    const userData = await users.findOne({"user": user});

    await client.close();
    return userData;
}



// --------------------------- USER FUNCTIONS --------------------------- //

async function isRegistered(user) {
    return (await whoIsUser(user)) ? true: false;
}


async function userSecret(user) {
    const userData = await whoIsUser(user);
    return (userData) ? userData.pass: null;
}


async function userCodes(user) {
    const userData = await whoIsUser(user);
    return (userData) ? userData.codes: null;
}


async function userConfig(user) {
    const userData = await whoIsUser(user);
    return (userData) ? userData.config: null;
}


async function histEnabled(user) {
    const config = await userConfig(user);
    return (config && config.chat_history);
}


async function initUser(user, hash) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const db = client.db(DB);
    const users = db.collection("users");
    const result = await users.insertOne({
        "user": user,
        "pass": hash,
        "config": VAL_CONFIG
    });

    await client.close();
    return (result) ? true: false;
}


async function removeUser(user) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const db = client.db(DB);
    const users = db.collection("users");
    const result = await users.deleteOne({"user": user});

    await client.close();
    return (result) ? true: false;
}


async function updateUserPass(user, newHash) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const db = client.db(DB);
    const users = db.collection("users");
    const result = await users.updateOne(
        {user: user},
        {$set: {["pass"]: newHash}},
        {upsert: false}
    );

    await client.close();
    return (result) ? true: false;
}


async function updateBackupCodes(user, hashes) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const db = client.db(DB);
    const users = db.collection("users");
    const result = await users.updateOne(
        {user: user},
        {$set: {["codes"]: hashes}},
        {upsert: false}
    );

    await client.close();
    return (result) ? true: false;
}


async function updateUserConfig(user, config) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const defaultConfig = VAL_CONFIG;
    let repairedConfig = defaultConfig;
    for (const name of Object.keys(defaultConfig)) {
        if (exists(config[name])) {
            repairedConfig[name] = config[name];
        }
    }

    const db = client.db(DB);
    const users = db.collection("users");
    const result = await users.updateOne(
        {user: user},
        {$set: {["config"]: repairedConfig}},
        {upsert: false}
    );

    await client.close();
    return (result) ? true: false;
}



// --------------------------- CHAT HISTORY --------------------------- //

async function saveChat(user, chat_title, msgs=[], nouns=[], verbs=[], convoID=null) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const db = client.db(DB);
    const users = db.collection("users");
    const userData = await users.findOne({user: user});

    if (userData) {
        const histCount = (userData.hasOwnProperty("chat_hist")) ? Object.keys(userData.chat_hist).length: 0;
        const hash = convoID ?? await hashChat(chat_title, histCount);
        
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
        
        await client.close();
        if (result) {
            return hash;
        }
    } else {
        await client.close();
        throw new UserDNE(`${user} does not exist in the database.`);
    }
}


async function clearChat(user) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const db = client.db(DB);
    const users = db.collection("users");
    const userData = await users.findOne({user: user});

    if (userData) {
        const result = await users.updateOne(
            {user: user},
            {$unset: {chat_hist: []}}
        );
        await client.close();
        return (result) ? true: false;
    } else {
        await client.close();
        throw new UserDNE(`${user} does not exist in the database.`);
    }
}


async function pullChat(user) {
    const client = new MongoClient(process.env.MONGO_CONN);
    await client.connect();

    const db = client.db(DB);
    const users = db.collection("users");
    const userData = await users.findOne({user: user});

    await client.close();
    if (userData) {
        return userData.chat_hist;
    } else {
        throw new UserDNE(`${user} does not exist in the database.`);
    }
}



// --------------------------- EXPORT FUNCTIONS --------------------------- //

module.exports = {
    isRegistered,
    userSecret,
    userCodes,
    userConfig,
    histEnabled,
    initUser,
    removeUser,
    updateUserPass,
    updateBackupCodes,
    updateUserConfig,
    saveChat,
    clearChat,
    pullChat
}