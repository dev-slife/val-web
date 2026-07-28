/**
 * Author: dev.slife
 * Date Created: 3/23/26
 * Date Updated: 7/28/26
 * Description:
 *      Handles main frontend interaction.
 */



// --------------------------- CONSTANTS --------------------------- //

const SESSION_ID = "val_user";
const THEMES = {
    "DARK": {
        "--bg-deep":       "#13131a",
        "--bg-sidebar":    "#0f0f15",
        "--bg-main":       "#1a1a24",
        "--bg-input":      "#0d0d12",
        "--bg-nav":        "#13131a",
        "--bg-card":       "#22223a",
        "--bg-btn":        "#2a2a4a",
        "--hover-blue":    "#7ab0e0",
        "--accent-blue":   "#5b9bd5",
        "--blue-glow":     "#258ae9",
        "--soft-blue":     "rgba(91, 155, 213, 0.2)",
        "--accent-yellow": "#c8b96e",
        "--accent-red":    "#d95f6e",
        "--soft-red":      "rgba(217, 95, 110, 0.2)",
        "--text-primary":  "#e8e8f0",
        "--text-muted":    "#7a7a9a",
        "--text-sidebar":  "#c0c0d8",
        "--border":        "#2a2a3a",
        "--btn-border":    "#3a3a5a",
        "--nav-border":    "#2e2e3e"
    },
    "LIGHT": {
        "--bg-deep":       "#f5f5f8",
        "--bg-sidebar":    "#eeeef3",
        "--bg-main":       "#ffffff",
        "--bg-input":      "#ffffff",
        "--bg-nav":        "#f5f5f8",
        "--bg-card":       "#f0f0f7",
        "--bg-btn":        "#e4e4f0",
        "--hover-blue":    "#2f6fb0",
        "--accent-blue":   "#3a7fc1",
        "--blue-glow":     "#1a6fd1",
        "--soft-blue":     "rgba(58, 127, 193, 0.12)",
        "--accent-yellow": "#a68f3d",
        "--accent-red":    "#c0394a",
        "--soft-red":      "rgba(192, 57, 74, 0.12)",
        "--text-primary":  "#1c1c26",
        "--text-muted":    "#6b6b85",
        "--text-sidebar":  "#33334a",
        "--border":        "#dcdce4",
        "--btn-border":    "#c8c8dc",
        "--nav-border":    "#d5d5e0"
    }
}



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


async function validURL(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (err) {
        return false;
    }
}


function findConfig(config, name) {
    for (const key of Object.keys(config)) {
        if (typeof config[key] == "object") {
            return findConfig(config[key], name);
        } else if (key == name) {
            return config[key];
        }
    }
}


async function updateBackground(theme) {
    if (theme) {
        const root = document.documentElement;
        for (const [prop, val] of Object.entries(THEMES[theme.toUpperCase()])) {
            root.style.setProperty(prop, val);
        }
    }
}



// --------------------------- ACCOUNT REQUESTS --------------------------- //

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



// --------------------------- BLOB REQUESTS --------------------------- //

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


async function getPFP(default_img=false) {
    try {
        const user = getUser();
        if (user) {
            const url = `/api/storage/pfp/pull?user=${user}`;
            const response = await fetch(url);
            const result = await response.json();
            if (response.status == 200 && await validURL(result["url"])) {
                return result["url"];
            }
        }
        return await getBlobItem();
    } catch (err) {
        console.error("Could not get pfp.");
    }
}



// --------------------------- DATABASE REQUESTS --------------------------- //

async function formatConfig(config) {
    let newConfig = {};

    for (const key of Object.keys(config)) {
        const keyArray = key.toLowerCase().split("");
        const _Index = keyArray.indexOf("_");

        if (_Index != -1 && _Index != keyArray.length - 1) {
            for (let i = 0; i < keyArray.length; i++) {
                if (keyArray[i] == '_') {
                    keyArray[i+1] = keyArray[i+1].toUpperCase();
                    const formattedKey = keyArray.join("").replaceAll('_', '');
                    
                    if (typeof config[key] == "object") {
                        newConfig[formattedKey] = await formatConfig(config[key]);
                    } else {
                        newConfig[formattedKey] = config[key];
                    }
                }
            }
        } else if (typeof config[key] == "object") {
            newConfig[key] = await formatConfig(config[key]);
        } else {
            newConfig[key] = config[key];
        }
    }

    return newConfig;
}


async function grabConfig() {
    try {
        const user = getUser();
        if (user) {
            const url = `/api/db/user/pull_config?user=${user}`;
            const response = await fetch(url);
            const data = await response.json();
            return await formatConfig(data.config);
        }
    } catch(err) {
        console.error(`An unexpected error occurred when attempting to grab user settings: ${err}`);
    }
}



// --------------------------- LOAD PAGE --------------------------- //

document.addEventListener("DOMContentLoaded", async() => {
    const loginBtn = document.getElementById("login");
    const registerBtn = document.getElementById("register");
    const user = document.getElementById("username");
    const pass = document.getElementById("pass");
    const errorMsg = document.getElementById("error-msg");
    const config = await grabConfig();

    if (config) {
        await updateBackground(findConfig(config, "theme"));
    }

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