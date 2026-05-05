/**
 * Author: dev.slife
 * Date Created: 4/30/26
 * Date Updated: 5/5/26
 * Description:
 *      Manages all account settings.
 */


// --------------------------- MODULE FUNCTIONS --------------------------- //

async function changePFP() {
    const user = "testUser";
    const testPFP = document.getElementById("testPFP");
    const fileInput = document.getElementById("inputPFP");
    const file = fileInput.files[0];
    
    if (user && file) {
        const formData = new FormData();
        formData.append('pfp', file);
        formData.append('user', user);

        try {
            const response = await fetch('/api/storage/pfp/upload', {
                method: "POST",
                body: formData
            });
            const result = await response.json();

            if (result) {
                testPFP.src = result["url"];
            }
        } catch (err) {
            console.error(err);
        }
    }
}

async function getPFP(user) {
    try {
        const url = `/api/storage/pfp/pull?user=${user}`;
        const response = await fetch(url);
        const result = await response.json();
        if (response.status == 200) {
            return result["url"];
        }
    } catch (err) {
        console.error("Could not get pfp.");
    }
}



// --------------------------- EVENTS --------------------------- //

document.addEventListener('DOMContentLoaded', async() => {
    const pfpForm = document.getElementById("uploadPFP");

    pfpForm.addEventListener("submit", async function(event) {
       event.preventDefault();
       await changePFP();
    });
});
















// Bunch of stuff to fix and clean up -- Also fix css and settings html


// --------------------------- SIDEBAR --------------------------- //

document.querySelectorAll('.settings-nav-item[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('section-' + btn.dataset.target).classList.add('active');
    });
});



// --------------------------- PFP PREVIEW --------------------------- //

document.getElementById('inputPFP').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = document.getElementById('testPFP');
        img.src = e.target.result;
        img.style.cssText = 'display:block; width:84px; height:84px; border-radius:50%; object-fit:cover; border:2px solid var(--border);';
        document.getElementById('pfpPlaceholder').style.display = 'none';
        document.getElementById('removePFPBtn').style.display = '';
    };
    reader.readAsDataURL(file);
    // Submit to API
    const form = document.getElementById('uploadPFP');
    const data = new FormData(form);
    fetch(form.action, { method: 'POST', body: data })
        .then(r => r.ok ? showToast('Profile picture updated!', '🖼️') : showToast('Upload failed — try again.', '⚠️'))
        .catch(() => showToast('Preview saved (offline).', '🖼️'));
});


function removePFP() {
    document.getElementById('testPFP').style.display = 'none';
    document.getElementById('pfpPlaceholder').style.display = '';
    document.getElementById('removePFPBtn').style.display = 'none';
    document.getElementById('inputPFP').value = '';
}



// --------------------------- TOAST --------------------------- //

let toastTimer;
function showToast(msg, icon = '✓') {
    clearTimeout(toastTimer);
    document.getElementById('toastMsg').textContent = msg;
    document.getElementById('toastIcon').textContent = icon;
    const t = document.getElementById('toast');
    t.classList.add('show');
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}



// --------------------------- SAVE STUBS --------------------------- //

function saveSection(section) {
    showToast('Changes saved successfully.', '✓');
    // TODO: hook into settings.js API calls
}



// --------------------------- PASSWORD STRENGTH --------------------------- //

function updateStrength(pw) {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const fill   = document.getElementById('strengthFill');
    const label  = document.getElementById('strengthLabel');
    const levels = [
        { w: '0%',   bg: 'transparent', txt: 'Enter a new password' },
        { w: '25%',  bg: '#ef5350',      txt: 'Weak' },
        { w: '50%',  bg: '#ff9800',      txt: 'Fair' },
        { w: '75%',  bg: '#ffeb3b',      txt: 'Good' },
        { w: '100%', bg: '#26c27a',      txt: 'Strong' },
    ];
    const l = pw.length === 0 ? levels[0] : levels[score];
    fill.style.width      = l.w;
    fill.style.background = l.bg;
    label.textContent     = l.txt;
}


function changePassword() {
    const np = document.getElementById('newPassword').value;
    const cp = document.getElementById('confirmPassword').value;
    if (!np) { showToast('Please enter a new password.', '⚠️'); return; }
    if (np !== cp) { showToast("Passwords don't match.", '⚠️'); return; }
    showToast('Password updated!', '🔑');
    ['currentPassword','newPassword','confirmPassword'].forEach(id => document.getElementById(id).value = '');
    updateStrength('');
}



// --------------------------- DANGER CONFIRMATIONS --------------------------- //

function confirmAction(type) {
    const msg = type === 'delete'
        ? 'Are you sure you want to permanently delete your account? This cannot be undone.'
        : 'Are you sure you want to reset all your progress? This cannot be undone.';
    if (confirm(msg)) {
        showToast(type === 'delete' ? 'Account deletion requested.' : 'Progress reset.', '⚠️');
    }
}