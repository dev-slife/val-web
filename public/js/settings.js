/**
 * Author: dev.slife
 * Date Created: 4/30/26
 * Date Updated: 5/1/26
 * Description:
 *      Manages all account settings.
 */


// --------------------------- MODULE FUNCTIONS --------------------------- //

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
    });
});