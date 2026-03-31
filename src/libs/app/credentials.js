/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 3/30/26
 * Description:
 *      Handles all account api functions.
 */


// --------------------------- IMPORTS & CONSTANTS --------------------------- //

const app = require("./app");



// --------------------------- SERVER FUNCTIONS --------------------------- //

app.get('/api/login', (req, res) => {
    const {user, pass} = req.query;
    // verify correct username and password with db
    console.error("Currently unable to manage account information.");
});

app.get('/api/register', (req, res) => {
    const {user, pass} = req.query;
    // verify correct username and password with db
    console.error("Currently unable to manage account information.");
});