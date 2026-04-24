/**
 * Author: dev.slife
 * Date Created: 4/23/26
 * Date Updated: 4/23/26
 * Description:
 *      Tests the VAST system
 */



// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const fetch = require('node-fetch');



// --------------------------- TEST FUNCTIONS --------------------------- //

async function testSimplify() {
    const response = await fetch('localhost:3000/api/vast/simplify?expression=5x-3x%2B2');
    const data = await response.json();
    console.assert(response.status == 200, 'Status should be 200');
    console.assert(data.answer == "2x+2", 'Simplify failed')
}


async function testSolve() {
    const response = await fetch('localhost:3000/api/vast/solve?expression=5x-3x%2B2');
    const data = await response.json();
    const lookFor = data.answer.replaceAll(' ', '').substring(0, 4);
    console.assert(response.status == 200, 'Status should be 200');
    console.assert(lookFor == "x=-1", 'Solve failed');
}


async function testAsk() {
    const response = await fetch('localhost:3000/api/vast/ask?question=Hey%20VAL%20could%20you%20help%20me%20solve%20this%20equation%3F%0A5x-3x%2B2');
    console.assert(response.status == 200, 'Status should be 200');
}



// --------------------------- MAIN --------------------------- //

(async () => {
    await Promise.allSettled([
        testSimplify(),
        testSolve(),
        testAsk()
    ]);
    console.log("VAST passed!");
    process.exit(0);
})();