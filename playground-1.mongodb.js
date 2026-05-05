/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'VAL_DATA';
const collectionName = 'users';

// Create a new database.
use(database);

// Create a new collection.
const collection = db.getCollection(collectionName);

const users = [
    { name: "dev-slife", pfp: "Rimuru Tempest" },
    { name: "val", pfp: "Luminous Valentine"}
];

collection.insertMany(users);

collection.find();