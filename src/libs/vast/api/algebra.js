/**
 * Author: dev.slife
 * Date Created: 3/22/26
 * Date Updated: 4/19/26
 * Description:
 *      Works with the VAST system (C++) to parse and solve math equations.
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const { spawn } = require('node:child_process');
const pyLib = "py.vast"



// ---------------------------- API FUNCTIONS ---------------------------- //

async function simplify(expression) {
    return new Promise((resolve, reject) => {
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
            reject(new Error(`Python stderr: ${data.toString()}`));
        })

        py.on("close", (code) => {
            console.log('Python exited with code:', code);
            
            if (output) {
                try {
                    const response = JSON.parse(output);
                    console.log("Data processed from Python.");
                    resolve(response);
                } catch (err) {
                    console.error('Invalid JSON from Python:', output);
                    reject(new Error(`Invalid JSON from Python: ${output}`));
                }
            }
        });
    });
}


async function solve(expression) {
    return new Promise((resolve, reject) => {
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
            reject(new Error(`Python stderr: ${data.toString()}`));
        })
    
        py.on("close", (code) => {
            console.log('Python exited with code:', code);
            
            if (output) {
                try {
                    const response = JSON.parse(output);
                    console.log("Data received from Python.");
                    resolve(response);
                } catch (err) {
                    console.error('Invalid JSON from Python:', output);
                    reject(new Error(`Invalid JSON from Python: ${output}`));
                }
            }
        });
    });
}



// --------------------------- EXPORTS --------------------------- //

module.exports = {
    simplify: simplify,
    solve: solve
}