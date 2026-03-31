/**
 * Author: dev.slife
 * Date Created: 3/22/26
 * Date Updated: 3/30/26
 * Description:
 *      Works with the VAST system (C++) to parse and solve math equations.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const app = require("./app");
const { spawn } = require('node:child_process');
const { dirname } = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pyLib = "py.vast"


// ---------------------------- API FUNCTIONS ---------------------------- //

app.get('/api/vast/simplify', (req, res) => {
    const { expression } = req.query;
    let output = "";

    const payload = JSON.stringify({
        "Eval": "simplify",
        "Input": expression
    });
    const py = spawn("python", ['-m', pyLib, payload], {
        cwd: __dirname
    });
    
    py.stdout.on("data", (data) => {
        output += data.toString();
    });

    py.stderr.on("data", (data) => {
        console.error('Python stderr:', data.toString());
    })

    py.on("close", (code) => {
        console.log('Python exited with code:', code);
        
        if (output) {
            try {
                const response = JSON.parse(output);
                console.log("Data received from Python: ", response);
                res.send(response);
            } catch (err) {
                console.error('Invalid JSON from Python:', output);
            }
        }
    });
});


app.get('/api/vast/solve', (req, res) => {
    const { expression } = req.query;
    let output = "";

    const payload = JSON.stringify({
        "Eval": "solve_literal",
        "Input": expression
    });
    const py = spawn("python", ['-m', pyLib, payload], {
        cwd: __dirname
    });
    
    py.stdout.on("data", (data) => {
        output += data.toString();
    });

    py.stderr.on("data", (data) => {
        console.error('Python stderr:', data.toString());
    })

    py.on("close", (code) => {
        console.log('Python exited with code:', code);
        
        if (output) {
            try {
                const response = JSON.parse(output);
                console.log("Data received from Python: ", response);
                res.send(response);
            } catch (err) {
                console.error('Invalid JSON from Python:', output);
            }
        }
    });
});