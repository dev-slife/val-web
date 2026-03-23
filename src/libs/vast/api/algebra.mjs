/**
 * Author: dev.slife
 * Date Created: 3/22/26
 * Date Updated: 3/23/26
 * Description:
 *      Works with the VAST system (C++) to parse and solve math equations.
 */



import { spawn } from 'node:child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pyLib = "py.vast"


// ---------------------------- API FUNCTIONS ---------------------------- //

export function simplify(expression) {
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
            } catch (err) {
                console.error('Invalid JSON from Python:', output);
            }
        }
    });
}


export function solve(expression) {
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
            } catch (err) {
                console.error('Invalid JSON from Python:', output);
            }
        }
    });
}


// TESTING
// const eq = "3x-10";
// simplify(eq);
// solve(eq);