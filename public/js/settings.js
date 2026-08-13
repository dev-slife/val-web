/**
 * Authors: dev.slife, sfesseha
 * Date Created: 4/30/26
 * Date Updated: 8/13/26
 * Description:
 *      Manages all account settings.
 */



// --------------------------- CONSTANTS --------------------------- //

const BACKUP_CODE_COUNT = 6;
// const HEX_CODES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']



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


// function toHex(byte) {
//     let char = byte % 16;

// }


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
        if (details.func) {
            btnConf.onclick = details.func;
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
                showToast("Deleting account and all data associated...", "🛡️");
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


async function applyCodes(codes) {
    try {
        popup(null, false);
        const user = getUser();
        if (user) {
            const url = "/api/db/user/gen-codes";
            const payload = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "user": user,
                    "codes": codes
                })
            }
            const response = await fetch(url, payload);
            const result = await response.json();
            if (result.success) {
                showToast("Backup Codes Applied To Account Successfully", "🔑");
            } else {
                showToast("An unexpected issue occurred when generating codes, try again.", "❌");
            }
        } else {
            showToast("How did you do that without logging in? Login buddy.", "😡");
        }
    } catch (err) {
        console.error("Failed to apply generated backup codes.");
    }
}


function genCodes() {
    let unsignedInts = new Uint32Array(BACKUP_CODE_COUNT);
    crypto.getRandomValues(unsignedInts);
    const codes = Array.from(unsignedInts).map(b => b.toString(16));
    popup({
        title: "Backup Codes",
        msg: `Below are 6 generated codes you can use to gain access to your account if applied.
        <br><br><b>PLEASE MAKE SURE THAT YOU RECEIVE A CONFIRMATION MESSAGE AND SAVE THESE CODES
        SOMEWHERE SAFE</b><br><br>${codes.join(' | ')}
        <button popovertargetaction="show" popovertarget="toast" onclick='copyToClip(${JSON.stringify(codes.join(" | "))}); showToast("Copied to Clipboard", "📋")'>📋</button>`,
        confText: "Apply To Account",
        denyText: "Don't Apply",
        func: async() => await applyCodes(codes)
    });
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
                    "user": user,
                    "pass": pass
                })
            }
            const response = await fetch(url, payload);
            const result = await response.json();
    
            if (result.success) {
                await popup(null, false);
                showToast("Chat history successfully erased.", "🗨️");
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