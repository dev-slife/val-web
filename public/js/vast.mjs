/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 3/30/26
 * Description:
 *      Communicates with the VAST system to handle all math logic.
 */


// --------------------------- MODULE FUNCTIONS --------------------------- //

export async function simplify(expression) {
    try {
        const url = `/api/vast/simplify?expression=${expression}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (error) {
        console.error("Could not simplify math equation.");
        return false;
    }
}

export async function solve(expression) {
    try {
        const url = `/api/vast/solve?expression=${expression}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (error) {
        console.error("Could not solve math equation.");
        return false;
    }
}