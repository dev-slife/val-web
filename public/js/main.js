/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 5/29/26
 * Description:
 *      Handles main frontend interaction.
 */


// --------------------------- CONSTANTS --------------------------- //

const SESSION_ID = "val_user";



// --------------------------- HELPER FUNCTIONS --------------------------- //

async function expressPage(url) {
    try {
        const response = await fetch(url);
        return response.url;
    } catch (error) {
        console.error("Could not fetch Express page using: ", url);
        return null;
    }
}



// --------------------------- MODULE FUNCTIONS --------------------------- //

async function changePage(page="home", is_index_file=false) {
    // First try to use the express route
    const expressURL = (page == "home") ? "/": "/" + page;
    const route = await expressPage(expressURL);

    if (route) {
        window.location.href = route;
    } else {
        const base_url = (is_index_file) ? "./pages/": "../pages/";
        const file_name = (page.includes(".html")) ? page: page+".html";
        const url = base_url + file_name;
        window.location.href = url;
    }
}


async function login(user, pass) {
    try {
        const url = "/api/db/user/login";
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user": user,
                "pass": pass
            })
        }
        const response = await fetch(url, payload);
        return response.json();
    } catch (error) {
        console.error("Account login failed.");
        return false;
    }
}


async function register(user, pass) {
    try {
        const url = "/api/db/user/register";
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user": user,
                "pass": pass
            })
        }
        const response = await fetch(url, payload);
        return response.json();
    } catch (error) {
        console.error("Could not register account.");
        return false;
    }
}


async function validURL(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (err) {
        return false;
    }
}


async function getBlobItem(imgName="default_pfp.png") {
    try {
        const url = `/api/storage/blob/pull?key=${imgName}`;
        const response = await fetch(url);
        const result = await response.json()
        if (response.status == 200) {
            return result["url"];
        }
    } catch (err) {
        console.error("Could not grab default avatar.");
    }
}


async function getPFP(user, default_img=false) {
    try {
        const url = `/api/storage/pfp/pull?user=${user}`;
        const response = await fetch(url);
        const result = await response.json();
        if (response.status == 200 && await validURL(result["url"])) {
            return result["url"];
        } else {
            return await getBlobItem();
        }
    } catch (err) {
        console.error("Could not get pfp.");
    }
}


function saveUser(user) {
    sessionStorage.setItem(SESSION_ID, JSON.stringify(user));
}


function getUser(user) {
    return JSON.parse(sessionStorage.getItem(SESSION_ID));
}



// --------------------------- LOAD PAGE --------------------------- //

document.addEventListener("DOMContentLoaded", async() => {
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const user = document.getElementById("username");
    const pass = document.getElementById("pass");
    const errorMsg = document.getElementById("error-msg");

    if (loginBtn) {
        loginBtn.addEventListener("click", async function (event) {
            event.preventDefault();
            if (user.value.length == 0 || pass.value.length == 0) {
                errorMsg.textContent = "Please enter a username and password.";
                errorMsg.style.display = "block";
            } else {
                const result = await login(user.value, pass.value);

                if (result["success"] && result["registered"]) {
                    saveUser(user.value);
                    await changePage("home");
                } else if (result["registered"]) {
                    errorMsg.textContent = "Incorrect username or password was given.";
                    errorMsg.style.display = "block";
                } else {
                    errorMsg.textContent = "User is not currently registered.";
                    errorMsg.style.display = "block";
                }
            }
        })
    }

    if (registerBtn) {
        registerBtn.addEventListener("click", async function (event) {
            event.preventDefault();
            if (user.value.length == 0 || pass.value.length == 0) {
                errorMsg.textContent = "Please enter a username and password.";
                errorMsg.style.display = "block";
            } else {
                const result = await register(user.value, pass.value);
                
                if (result["success"] && result["registered"]) {
                    saveUser(user.value);
                    await changePage("home");
                } else if (result["registered"]) {
                    errorMsg.textContent = "Username is already taken.";
                    errorMsg.style.display = "block";
                } else {
                    errorMsg.textContent = "An unexpected error occurred.";
                    errorMsg.style.display = "block";
                }
            }
        })
    }
});


document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'CANVAS') {
        e.preventDefault();
    }
});