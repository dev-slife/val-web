/**
 * Author: dev.slife
 * Date Created: 3/22/26
 * Date Updated: 8/25/26
 * Description:
 *      Works with the AMA system (C++) to parse and solve math equations.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const {spawn} = require('node:child_process');
const pyLib = "py.ama"



// ---------------------------- AMA ERRORS ---------------------------- //

class AMAError extends Error {
    // Custom Exception for AMA errors.
    constructor(message="An unexpected error occurred when using AMA.") {
        this.super(message);
        this.name = "AMAError";
    }
}

class NotEstablishedYet extends AMAError {
    // AMAError for functions or objects that haven't been established yet.
    constructor(message="Arithmetic operation not established.") {
        this.super(message);
        this.name = "NotEstablishedYet";
    }
}

class InvalidEquation extends AMAError {
    // AMAError for invalid equations that are given.
    constructor(message="The given equation is not valid.") {
        this.super(message);
        this.name = "InvalidEquation";
    }
}

class UndefinedVariable extends AMAError {
    // AMAError for undefined variables.
    constructor(message="The given variable does not have an assigned value.") {
        this.super(message);
        this.name = "UndefinedVariable";
    }
}

class InvalidType extends AMAError {
    // AMAError for invalid data types that are given.
    constructor(message="The given data type is invalid.") {
        this.super(message);
        this.name = "InvalidType";
    }
}



// ---------------------------- HELPER FUNCTIONS ---------------------------- //

function throwAMAException(errType, errMsg) {
    return (errType == "NotEstablishedYet") ? new NotEstablishedYet(errMsg):
        (errType == "InvalidEquation") ? new InvalidEquation(errMsg):
        (errType == "UndefinedVariable") ? new UndefinedVariable(errMsg):
        (errType == "InvalidType")? new InvalidType(errMsg):
        new AMAError(errMsg);
}


async function callAMA(payload) {
    return new Promise((resolve, reject) => {
        let output = "";

        const py = spawn("python", ['-m', pyLib, payload], {
            cwd: __dirname
        });

        py.stdout.on("data", (data) => {
            output += data.toString();
        });

        py.stderr.on("data", (data) => {
            console.log(data);
            if (data) {
                const errStream = data.toString();
                console.log(errStream);
                if (errStream) {
                    const errData = errStream.match(/(?<header>py\.errors\.)(?<error>\w+):\s(?<message>.+)/)
                    console.log(errData);
                    if (errData) {
                        const errType = errData["error"];
                        const errMsg = errData["message"];
            
                        console.warn('Python stderr:', errStream);
                        reject(throwAMAException(errType, errMsg));
                    }
                }
            }
            reject(new Error(`An unexpected Python error occurred: ${data}`));
        })

        py.on("close", (code) => {
            if (output) {
                try {
                    const response = JSON.parse(output);
                    resolve(response);
                } catch (err) {
                    console.error('Invalid JSON from Python:', output);
                    reject(new Error(`Invalid JSON from Python: ${output}`));
                }
            }
        });
    });
}



// ---------------------------- API FUNCTIONS ---------------------------- //

async function simplify(expression) {
    const payload = JSON.stringify({
        "Eval": "simplify",
        "Input": expression
    });

    return await callAMA(payload);
}


async function solve(expression) {
    const payload = JSON.stringify({
        "Eval": "solve_literal",
        "Input": expression
    });

    return await callAMA(payload);
}


async function equivalent(expression1, expression2) {
    const payload = JSON.stringify({
        "Eval": "equivalent",
        "Input": [expression1, expression2]
    });

    return await callAMA(payload);
}



// --------------------------- EXPORTS --------------------------- //

module.exports = {
    simplify,
    solve,
    equivalent,
    InvalidType,
    UndefinedVariable,
    InvalidEquation,
    NotEstablishedYet,
    AMAError
}