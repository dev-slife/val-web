/**
 * Author: dev.slife
 * Date Created: 3/22/26
 * Date Updated: 3/22/26
 * Description:
 *      Works with the VAST system (C++) to parse and solve math equations.
 */



const { spawn } = require("child_process");

const pyLib = "vast.py"
const py = spawn("python", [pyLib]);


// ---------------------------- API FUNCTIONS ---------------------------- //

export function simplify(expression) {
    return new Promise((resolve, reject) => {
        const onData = (data) => {
            const lines = data.toString().trim().split('\n');
            try {
                const last = lines.filter(Boolean).slice(-1)[0];
                const msg = JSON.parse(last);
                py.stdout.off("data", onData);
                resolve(msg);
            } catch (e) {
                py.stdout.off("data", onData);
                reject(e);
            }
        };

        py.stdout.on("data", onData);
        py.stderr.once("data", (err) => {
            py.stdout.off("data", onData);
            reject(new Error(err.toString()));
        });

        const payload = {eq: String(expression)};
        py.stdin.write(JSON.stringify(payload) + '\n');
    })
}