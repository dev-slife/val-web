/**
 * Author: dev.slife, sfesseha
 * Date Created: 4/30/26
 * Date Updated: 5/7/26
 * Description:
 *      Manages all account settings.
 */


// --------------------------- HELPER FUNCTIONS --------------------------- //

let toastTimer;
function showToast(msg, icon = "🌠") {
    clearTimeout(toastTimer);
    document.getElementById("toastMsg").textContent = msg;
    document.getElementById("toastIcon").textContent = icon;
    const t = document.getElementById("toast");
    t.classList.add("show");
    toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}


function saveSection(section) {
    showToast("Changes saved successfully.");
    // TODO: hook into settings.js API calls
}


function confirmAction() {
    const msg = "Are you sure you want to permanently delete your account? This action is irreversible!";
    if (confirm(msg)) {
        showToast("Account deleted.", "🗑️");
    }
}



// --------------------------- PASSWORDS --------------------------- //

function updateStrength(pw) {
    let score = 1;
    if (pw.length >= 8) {
        score++;
    }
    if (/[A-Z]/.test(pw)) {
        score++;
    }
    if (/[0-9]/.test(pw)) {
        score++;
    }
    if (/[^A-Za-z0-9]/.test(pw)) {
        score++;
    }
    const fill = document.getElementById("strengthFill");
    const label = document.getElementById("strengthLabel");
    const levels = [
        { w: "0%", bg: "transparent", txt: "Enter a new password" },
        { w: "20%", bg: "#ef5350", txt: "Very Weak" },
        { w: "40%", bg: "#ff9800", txt: "Weak" },
        { w: "60%", bg: "#ffeb3b", txt: "Moderate" },
        { w: "80%", bg: "#aaff3b", txt: "Good" },
        { w: "100%", bg: "#26c27a", txt: "Strong" },
    ];
    const l = (pw.length == 0) ? levels[0] : levels[score];
    fill.style.width = l.w;
    fill.style.background = l.bg;
    label.textContent = l.txt;
}


function changePassword() {
    const curPass = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const conPass = document.getElementById("confirmPassword").value;
    if (!curPass) {
        showToast("Please enter your current password.", "🔒");
    }
    if (!newPass) {
        showToast("Please enter a new password.", "🔒");
        return;
    }
    if (newPass !== conPass) {
        showToast("Passwords don't match.", "❌");
        return;
    }
    showToast("Password updated!", "🔑");
    ["currentPassword", "newPassword", "confirmPassword"].forEach(id => document.getElementById(id).value = "");
    updateStrength("");
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
    const url = await getPFP(getUser(), true);

    showPFP(url);

    pfpForm.addEventListener("change", async function() {
        await changePFP();
    });


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