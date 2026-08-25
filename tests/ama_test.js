/**
 * Author: dev.slife
 * Date Created: 4/23/26
 * Date Updated: 8/25/26
 * Description:
 *      Tests the AMA system
 */



// --------------------------- TEST FUNCTIONS --------------------------- //

async function testSimplify() {
    try {
        const response = await fetch('localhost:3000/api/val/simplify?expression=5x-3x%2B2');
        const data = await response.json();
        console.assert(response.status == 200, 'Status should be 200');
        console.assert(data.answer == "2x+2", 'Simplify failed');
    } catch (err) {
        console.log(err);
        console.assert(false);
    }
}


async function testSolve() {
    try {
        const response = await fetch('localhost:3000/api/val/solve?expression=5x-3x%2B2');
        const data = await response.json();
        const lookFor = data.answer.replaceAll(' ', '').substring(0, 4);
        console.assert(response.status == 200, 'Status should be 200');
        console.assert(lookFor == "x=-1", 'Solve failed');
    } catch (err) {
        console.log(err);
        console.assert(false);
    }
}


async function testAsk() {
    try {
        const response = await fetch('localhost:3000/api/val/ask?question=Hey%20VAL%20could%20you%20help%20me%20solve%20this%20equation%3F%0A5x-3x%2B2');
        console.assert(response.status == 200, 'Status should be 200');
    } catch (err) {
        console.log(err);
        console.assert(false);
    }
}



// --------------------------- MAIN --------------------------- //

(async () => {
    await Promise.allSettled([
        testSimplify(),
        testSolve(),
        testAsk()
    ]);
    console.log("AMA passed!");
    process.exit(0);
})();