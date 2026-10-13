document.addEventListener("DOMContentLoaded", async() => {
    const req = new XMLHttpRequest();
    req.open('HEAD', window.location.href, false);
    req.send(null);

    const username = req.getResponseHeader('Username');
    const pfp = req.getResponseHeader('User-Image');
    const bio = req.getResponseHeader('User-Bio');

    const nameObj = document.getElementById("username");
    const avatarObj = document.getElementById("avatar");
    const bioObj = document.getElementById("bio");

    if (pfp) {
        avatarObj.src = decodeURIComponent(pfp);
        avatarObj.style.display = "inline";
    }
    nameObj.textContent = (username) ? decodeURIComponent(username): "N/A";
    bioObj.textContent = (bio) ? decodeURIComponent(bio): "No bio";
});