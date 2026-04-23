/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 4/22/26
 * Description:
 *      Communicates with the VAST system to handle all math logic.
 */



// --------------------------- MODULE FUNCTIONS --------------------------- //

async function simplify(expression) {
    try {
        const url = `/api/vast/simplify?expression=${encodeURIComponent(expression)}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (err) {
        console.error("Could not simplify math equation.");
        return false;
    }
}

async function solve(expression) {
    try {
        const url = `/api/vast/solve?expression=${encodeURIComponent(expression)}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (err) {
        console.error("Could not solve math equation.");
        return false;
    }
}

async function ask(question) {
    try {
        const url = `/api/vast/ask?question=${encodeURIComponent(question)}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (err) {
        console.error(`An unexpected error occurred when asking VAL your question: ${err}`);
        return false;
    }
}