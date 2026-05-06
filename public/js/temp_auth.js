/**
 * Author: jbeshir-umd
 * Date Created: 5/6/26
 * Date Updated: 5/6/26
 * Description:
 *      Handles session-based authentication using sessionStorage.
 *      Included on every page — runs checkAuth() automatically on load.
 */


// --------------------------- HELPER FUNCTIONS --------------------------- //

function getUser() {
    try {
        return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {
        return null;
    }
}


function isLoggedIn() {
    return getUser() !== null;
}


function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    changePage("login");
}



// --------------------------- LOAD PAGE --------------------------- //

document.addEventListener('DOMContentLoaded', async() => {
    const user = getUser();
    const signInBtn = document.querySelector('.sign-in-btn');
    const nameText = document.getElementById("accountName");
    const pfpImg = document.getElementById("accountPFP"); 

    if (user) {
        if (signInBtn) {
            signInBtn.textContent = 'Sign Out';
            signInBtn.addEventListener('click', logout);
            if (nameText) {
                nameText.textContent = user;
            }
            if (pfpImg) {
                const pfpURL = await getPFP(user, true);
                pfpImg.src = pfpURL;
            }
        }
    } else {
        if (signInBtn) {
            signInBtn.textContent = 'Sign In';
        }
        if (nameText) {
            nameText.textContent = "";
        }
        if (pfpImg) {
            pfpImg.src = "";
        }
    }
});



// --------------------------- EXPORT --------------------------- //

exports = {
    logout: logout,
    getUser: getUser,
    isLoggedIn: isLoggedIn
};