/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 5/30/26
 * Description:
 *      Communicates with the VAST system to handle all math logic.
 */



// --------------------------- API FUNCTIONS --------------------------- //

async function simplify(expression) {
    try {
        const url = `/api/val/simplify?expression=${encodeURIComponent(expression)}`;
        const response = await fetch(url);
        const result = response.json();
        if (result) {
            return result.solution;
        }
    } catch (err) {
        console.error("Could not simplify math equation.");
        return false;
    }
}


async function solve(expression) {
    try {
        const url = `/api/val/solve?expression=${encodeURIComponent(expression)}`;
        const response = await fetch(url);
        const result = response.json();
        if (result) {
            return result.solution;
        }
    } catch (err) {
        console.error("Could not solve math equation.");
        return false;
    }
}


async function ask(question, model_id) {
    try {
        const url = "/api/val/ask";
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user": getUser(),
                "model_id": model_id,
                "question": question
            })
        }
        const response = await fetch(url, payload);
        return response.json();
    } catch (err) {
        console.error(`An unexpected error occurred when asking VAL your question: ${err}`);
        return false;
    }
}


async function grabHist() {
    try {
        const user = getUser();
        if (user) {
            const url = `/api/db/user/pull_chat?user=${encodeURIComponent(user)}`;
            const response = await fetch(url);
            return response.json();
        }
    } catch (err) {
        console.error(`An unexpected error occurred when grabbing the message history: ${err}`);
        return false;
    }
}


async function updateHist(title, hist) {
    try {
        const user = getUser();
        const url = "/api/db/user/save_chat";
        const payload = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "user": user,
                "title": title,
                "msgs": hist
            })
        }
        const response = await fetch(url, payload);
        return response.json();
    } catch (err) {
        console.error(`An unexpected error occurred when updating the chat history: ${err}`);
        return false;
    }
}



// --------------------------- MODULE FUNCTIONS --------------------------- //

function showTyping(messages) {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message val";
    typingIndicator.innerHTML = 
        `<div class='typing'>
            <div class='dot'></div>
            <div class='dot'></div>
            <div class='dot'></div>
        </div>`;
    
    messages.appendChild(typingIndicator);
    messages.scrollTop = messages.scrollHeight;
    return typingIndicator;
}


function hideTyping(messages, typingIndicator) {
    if (typingIndicator) {
        messages.removeChild(typingIndicator);
        typingIndicator = null;
    }
}


function loadImage(url) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };

    img.src = url;
    return canvas;
}


async function loadMessages() {
    const data = await grabHist();
    console.log(data);
}


function messageSender() {
    const userInput = document.getElementById("mathInput");
    const messages = document.getElementById("messages");
    let messageTitle = "";
    let processing = false;
    let logoHidden = false;
    let userResponse = "";
    let guest_id = null;
    
    async function addMessage(text, sender, typingIndicator) {
        const messages = document.getElementById("messages");
        if (typingIndicator) hideTyping(messages, typingIndicator);
    
        const message = document.createElement("div");
        message.className = `message ${sender.toLowerCase()}`;
        
        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.id = sender.toLowerCase();
        bubble.textContent = text;
        
        const imgUrl = (sender.toLowerCase() == "val") ? await getBlobItem("FullLV002.png"): await getPFP();
        const bubbleImg = loadImage(imgUrl);
        bubbleImg.className = "bubble-img";
        
        message.appendChild(bubbleImg);
        message.appendChild(bubble);
        messages.appendChild(message);
        if (messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 5) {
            messages.scrollTop = messages.scrollHeight;
        }
    }

    async function processMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        
        userInput.value = "";
        await addMessage(text, "user");
        const response = await ask(text, guest_id);

        if (response) {
            messageTitle = response.chat_title;
            for (const msg of response.reply) {
                let typingIndicator = showTyping(messages);
                await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
                await addMessage(msg, "VAL", typingIndicator);
            }
        } else {
            await addMessage("Sorry, I'm having trouble connecting with the server right now, please try again later.'.", "VAL", typingIndicator);
        }
    }

    return async function sendMessage() {
        if (processing) { return; }
        processing = true;

        if (!logoHidden) {
            const logo = document.getElementById("logo");
            const homePage = document.getElementById("homePage");
            const messages = document.getElementById("messages");
            logo.style.display = "none";
            homePage.style.overflow = "auto";
            homePage.style.height = "auto";
            messages.style.height = "68vh";
            logoHidden = true;
        }
        
        await processMessage();
        processing = false;
    }
}



// --------------------------- LOAD PAGE --------------------------- //

document.addEventListener("DOMContentLoaded", async() => {
    const userInput = document.getElementById("mathInput");
    const sendBtn = document.getElementById("sendBtn");
    await loadMessages();
    const sendMessage = messageSender();

    sendBtn.addEventListener("click", async() => {
        await sendMessage();
    });

    userInput.addEventListener("keypress", async(e) => {
        if (e.key === "Enter") {
            await sendMessage();
        }
    });
});