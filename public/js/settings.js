/**
 * Authors: dev.slife, sfesseha
 * Date Created: 4/30/26
 * Date Updated: 8/6/26
 * Description:
 *      Manages all account settings.
 */



// --------------------------- HELPER FUNCTIONS --------------------------- //

let toastTimer;
function showToast(msg, icon="🌠", lifetime=3) {
    clearTimeout(toastTimer);
    document.getElementById("toastMsg").textContent = msg;
    document.getElementById("toastIcon").textContent = icon;
    const t = document.getElementById("toast");
    t.classList.add("show");
    toastTimer = setTimeout(() => t.classList.remove("show"), 1000 * lifetime);
}


async function popup(details={}, open=true) {
    const popup = document.getElementById("popup");
    
    if (open) {
        const header = document.getElementById("popup-title");
        const info = document.getElementById("popup-info");
        const label = document.getElementById("popup-label");
        const field = document.getElementById("popup-field");
        const textBox =  document.getElementById("popup-input");
        const btnConf = document.getElementById("popup-conf");
        const btnDeny = document.getElementById("popup-deny");

        document.getElementById("popup-error").hidden = true;
        
        SFX.FOCUS.play();
        if (details.pType) {
            if (details.pType == "account_removal") {
                btnConf.onclick = await deleteAccount();
            } else if (details.pType == "clear_chat_history") {
                btnConf.onclick = await clearChatHistory();
            }
        }
        header.textContent = details.title ?? "";
        info.innerHTML = details.msg ?? "";
        label.textContent = details.inputLabel ?? "";
        btnConf.textContent = details.confText ?? "";
        btnDeny.textContent = details.denyText ?? "";
        textBox.value = "";
        field.style.display = (label.textContent == "") ? "none": "block";
        popup.showModal();
        popup.classList.add("show");
    } else {
        popup.classList.remove("show");
        popup.close();
    }
}



// --------------------------- ACCOUNT CONFIG --------------------------- //

async function updateConfig(config) {
    try {
        const user = getUser();
        if (user) {
            const url = "/api/db/user/update-config";
            const payload = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "user": user,
                    "config": config
                })
            }
            const response = await fetch(url, payload);
            return response.json();
        }
    } catch(err) {
        console.error(`An unexpected error occurred when attempting to update user settings: ${err}`);
    }
}


async function saveSection(section) {
    let success;

    if (section == "preferences") {
        const theme = document.getElementById("theme");
        const chatHist = document.getElementById("chatHistory");
        const reduceMotion = document.getElementById("reduceMotion");
        const highContrast = document.getElementById("highContrast");
        const screenReader = document.getElementById("screenReader");
        const response = await updateConfig({
            chat_history: chatHist.checked,
            theme: theme.value,
            accessibility: {
                reduce_motion: reduceMotion.checked,
                high_contrast: highContrast.checked,
                screen_reader: screenReader.checked
            }
        });
        await updateBackground(theme.value);
        success = (response && response.success);
    } else if (section == "notifications") {
        const sound = document.getElementById("soundEffects");
        const response = await updateConfig({
            sound_effects: sound.checked
        });
        success = (response && response.success);
    } else if (section == "profile") {
        const bio = document.getElementById("bio");
        const response = await updateConfig({
            bio: bio.value
        });
        success = (response && response.success);
    }

    if (success) {
        showToast("Changes saved successfully.");
    } else {
        showToast("Something went wrong, could not save changes.", "⚠️");
    }
}



// --------------------------- ACCOUNT SECURITY --------------------------- //

async function deleteAccount() {
    const msg = document.getElementById("popup-error");
    const pass = document.getElementById("popup-input").value;
    const user = getUser();

    if (user) {
        if (pass) {
            const url = "/api/db/user/delete";
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
            const result = await response.json();
    
            if (result.success) {
                msg.textContent = "Deleting account and all data associated...";
                msg.hidden = false;
                await setTimeout(async() => {
                    await logout();
                }, 2000);
            } else if (!result.authorized) {
                msg.textContent = "The password you entered was incorrect.";
                msg.hidden = false;
            } else {
                msg.textContent = "The server ran into an unexpected error, try again later.";
                msg.hidden = false;
            }
        } else {
            msg.textContent = "No password was given.";
            msg.hidden = false;
        }
    } else {
        msg.textContent = "How did you do that? Login buddy.";
        msg.hidden = false;
    }
}


async function changePassword() {
    const curPass = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const conPass = document.getElementById("confirmPassword").value;

    if (!curPass) {
        showToast("Please enter your current password.", "🔒");
    } else if (!newPass) {
        showToast("Please enter a new password.", "🔒");
    } else if (newPass !== conPass) {
        showToast("Your new passwords don't match.", "❌");
    } else {
        try {
            const user = getUser();
            if (user) {
                const url = "/api/db/user/update-pass";
                const payload = {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "user": user,
                        "pass": curPass,
                        "newPass": newPass
                    })
                }
                const response = await fetch(url, payload);
                const result = await response.json();
                if (result.success) {
                    showToast("Password updated!", "🔑");
                    ["currentPassword", "newPassword", "confirmPassword"].forEach(id => document.getElementById(id).value = "");
                    updateStrength("");
                    await setTimeout(async() => {
                        await logout();
                    }, 2000);
                } else if (!result.authorized) {
                    showToast("Incorrect password given.", "🔒");
                }
            } else {
                showToast("How did you do that without logging in? Login buddy.", "😡");
            }
        } catch (err) {
            console.error("Change password failed.");
        }
    }
}


async function clearChatHistory() {
    const msg = document.getElementById("popup-error");
    const pass = document.getElementById("popup-input").value;
    const user = getUser();

    if (user) {
        if (pass) {
            const url = "/api/db/user/clear-chat";
            const payload = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "user": user
                })
            }
            const response = await fetch(url, payload);
            const result = await response.json();
    
            if (result.success) {
                msg.textContent = "Chat history successfully erased.";
                msg.hidden = false;
                await setTimeout(async() => {
                    await popup(null, false);
                }, 2000);
            } else if (!result.authorized) {
                msg.textContent = "The password you entered was incorrect.";
                msg.hidden = false;
            } else {
                msg.textContent = "The server ran into an unexpected error, try again later.";
                msg.hidden = false;
            }
        } else {
            msg.textContent = "No password was given.";
            msg.hidden = false;
        }
    } else {
        msg.textContent = "How did you do that? Login buddy.";
        msg.hidden = false;
    }
}



// --------------------------- PROFILE PICTURE --------------------------- //

function showPFP(url) {
    const avatar = document.getElementById("avatar");
    const placeholder = document.getElementById("pfpPlaceholder");
    const removeBtn = document.getElementById("removePFPBtn");

    avatar.src = url;
    avatar.style.display = "";
    placeholder.style.display = "none";
    removeBtn.style.display = "";
}


function removePFP() {
    document.getElementById("avatar").style.display = "none";
    document.getElementById("pfpPlaceholder").style.display = "";
    document.getElementById("removePFPBtn").style.display = "none";
    document.getElementById("inputPFP").value = "";
}


async function changePFP() {
    const user = getUser();
    const fileInput = document.getElementById("inputPFP");
    const file = fileInput.files[0];
    
    if (user && file) {
        const formData = new FormData();
        formData.append("pfp", file);
        formData.append("user", user);

        try {
            const response = await fetch("/api/storage/pfp/upload", {
                method: "POST",
                body: formData
            });
            const result = await response.json();

            if (result) {
                showPFP(result["url"]);
                showToast("Profile picture updated!");
            } else {
                showToast("Upload failed - please try again.", "⚠️");
            }
        } catch (err) {
            console.error(err);
            showToast("Upload failed - please try again.", "⚠️");
        }
    }
}



// --------------------------- EVENTS --------------------------- //

document.addEventListener("DOMContentLoaded", async() => {
    const pfpForm = document.getElementById("inputPFP");
    const url = await getPFP(true);
    const config = await grabConfig();


    // PFP
    showPFP(url);
    pfpForm.addEventListener("change", async function() {
        await changePFP();
    });


    if (config) {
        // TOGGLES
        document.querySelectorAll(".toggle input[type=checkbox]").forEach(inp => {
            inp.checked = findConfig(config, inp.id);
        });

        // TEXT BOXES
        document.querySelectorAll(".field textarea").forEach(textBox => {
            textBox.value = findConfig(config, textBox.id);
        });

        // DROPDOWNS
        document.querySelectorAll(".field select").forEach(dropDown => {
            const val = findConfig(config, dropDown.id);
            if (val) {
                dropDown.value = findConfig(config, dropDown.id);
            }
        });
    }


    // SIDEBAR
    document.querySelectorAll(".settings-nav-item[data-target]").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".settings-nav-item").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".settings-section").forEach(s => s.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("section-" + btn.dataset.target).classList.add("active");
        });
    });
});