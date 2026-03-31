/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 3/30/26
 * Description:
 *      Requests logins/registrations for accounts.
 */


// --------------------------- MODULE FUNCTIONS --------------------------- //

export async function login(user, pass) {
    try {
        const url = `/api/login?user=${user}&pass=${pass}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (error) {
        console.error("Account login failed.");
        return false;
    }
}

export async function register(user, pass) {
    try {
        const url = `/api/register?user=${user}&pass=${pass}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (error) {
        console.error("Could not register account.");
        return false;
    }
}