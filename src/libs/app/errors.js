/**
 * Author: dev.slife
 * Date Created: 5/30/26
 * Date Updated: 5/30/26
 * Description:
 *      Defines all custom errors that could occur on the backend.
 */



// --------------------------- VAST ERRORS --------------------------- //

const {
    VASTError,
    NotEstablishedYet,
    InvalidEquation,
    UndefinedVariable,
    InvalidType
} = require("../vast/api/algebra.js");



// --------------------------- BASE ERRORS --------------------------- //

class VALError extends Error {
    // Custom exception for general server errors VAL encounters.
    constructor(message="VAL encountered an unexpected error.") {
        this.super(message);
        this.name = "VALError";
    }
}



// --------------------------- DB ERRORS --------------------------- //

class UserDNE extends VALError {
    // VALError for whenever a script attempts to access a user that does not exist.
    constructor(message="VAL could not find the given user.") {
        this.super(message);
        this.name = "UserDNE";
    }
}



// --------------------------- FILE STORAGE ERRORS --------------------------- //

class BucketDNE extends VALError {
    // VALError for whenever a script attempts to access a bucket that does not exist.
    constructor(message="VAL could not find the given bucket.") {
        this.super(message);
        this.name = "BucketDNE";
    }
}



// --------------------------- EXPORT ERRORS --------------------------- //

module.exports = {
    VASTError,
    NotEstablishedYet,
    InvalidEquation,
    UndefinedVariable,
    InvalidType,
    VALError,
    UserDNE,
    BucketDNE
}