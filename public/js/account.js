/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 4/22/26
 * Description:
 *      Requests logins/registrations for accounts.
 */


// --------------------------- MODULE FUNCTIONS --------------------------- //

async function login(user, pass) {
    try {
        const url = `/api/credentials/login?user=${user}&pass=${pass}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (error) {
        console.error("Account login failed.");
        return false;
    }
}

async function register(user, pass) {
    try {
        const url = `/api/credentials/register?user=${user}&pass=${pass}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (error) {
        console.error("Could not register account.");
        return false;
    }
}