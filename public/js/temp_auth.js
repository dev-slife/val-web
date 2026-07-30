/**
 * Authors: dev.slife, jbeshir-umd
 * Date Created: 5/6/26
 * Date Updated: 7/30/26
 * Description:
 *      Handles session-based authentication using sessionStorage and checks automatically on load.
 */


// --------------------------- HELPER FUNCTIONS --------------------------- //

function saveUser(user) {
    if (user) {
        sessionStorage.setItem(SESSION_ID, JSON.stringify(user));
    }
}


function getUser() {
    const user = sessionStorage.getItem(SESSION_ID);
    return (user) ? JSON.parse(user): null;
}


function isLoggedIn() {
    return getUser() !== null;
}


async function logout() {
    sessionStorage.removeItem(SESSION_ID);
    await changePage("login");
}



// --------------------------- LOAD PAGE --------------------------- //

document.addEventListener("DOMContentLoaded", async() => {
    const user = getUser();
    const signInBtn = document.querySelector(".sign-in-btn");
    const accountInfo = document.querySelector(".account-info");
    const nameText = document.getElementById("accountName");
    const pfpImg = document.getElementById("accountPFP"); 
    const settingsBtn = document.getElementById("settingsBtn")

    if (user) {
        if (signInBtn) {
            signInBtn.textContent = "Sign Out";
            signInBtn.addEventListener("click", logout);
        }
        if (accountInfo) {
            accountInfo.style.display = "";
            if (nameText) {
                nameText.textContent = user;
            }
            if (pfpImg) {
                const pfpURL = await getPFP(true);
                pfpImg.src = pfpURL;
            }
        }
        if (settingsBtn) {
            settingsBtn.style.display = ""; 
        }
    } else {
        if (signInBtn) {
            signInBtn.textContent = "Sign In";
        }
        if (accountInfo) {
            accountInfo.style.display = "none";
        }
        if (settingsBtn) {
            settingsBtn.style.display = "none"; 
        }
    }
});