/**
 * Author: dev.slife
 * Date Created: 3/22/26
 * Date Updated: 3/31/26
 * Description:
 *      Works with the VAST system (C++) to parse and solve math equations.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const express = require("express");
const router = express.Router();

const { spawn } = require('node:child_process');
const pyLib = "py.vast"



// ---------------------------- API FUNCTIONS ---------------------------- //

router.get('/simplify', (req, res) => {
    const { expression } = req.query;
    console.log(decodeURIComponent(expression));
    let output = "";

    const payload = JSON.stringify({
        "Eval": "simplify",
        "Input": decodeURIComponent(expression)
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


router.get('/solve', (req, res) => {
    const { expression } = req.query;
    let output = "";
    console.log(decodeURIComponent(expression));

    const payload = JSON.stringify({
        "Eval": "solve_literal",
        "Input": decodeURIComponent(expression)
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



// --------------------------- EXPORT ROUTER --------------------------- //

module.exports = router;