/**
 * Author: dev.slife
 * Date Created: 4/30/26
 * Date Updated: 4/30/26
 * Description:
 *      Manages all account settings.
 */


// --------------------------- MODULE FUNCTIONS --------------------------- //

async function changePFP(user) {
    try {
        const url = `/api/storage/pfp/upload?user=${user}`;
        const response = await fetch(url);
        const result = response.json();
        if (response.status == 200) {
            return result["url"];
        }
    } catch (err) {
        console.error("Could not update pfp.");
    }
}

async function getPFP(user) {
    try {
        const url = `/api/storage/pfp/pull?user=${user}`;
        const response = await fetch(url);
        const result = response.json();
        if (response.status == 200) {
            return result["url"];
        }
    } catch (err) {
        console.error("Could not get pfp.");
    }
}