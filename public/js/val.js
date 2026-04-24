/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 4/24/26
 * Description:
 *      Communicates with the VAST system to handle all math logic.
 */



// --------------------------- API FUNCTIONS --------------------------- //

async function simplify(expression) {
    try {
        const url = `/api/vast/simplify?expression=${encodeURIComponent(expression)}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (err) {
        console.error("Could not simplify math equation.");
        return false;
    }
}

async function solve(expression) {
    try {
        const url = `/api/vast/solve?expression=${encodeURIComponent(expression)}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (err) {
        console.error("Could not solve math equation.");
        return false;
    }
}

async function ask(question) {
    try {
        const url = `/api/vast/ask?question=${encodeURIComponent(question)}`;
        const response = await fetch(url);
        const success = await response.json();
        return success;
    } catch (err) {
        console.error(`An unexpected error occurred when asking VAL your question: ${err}`);
        return false;
    }
}



// --------------------------- MODULE FUNCTIONS --------------------------- //

async function generateResponses(text) {
    const result = await ask(text);
    const messages = result["slm"];
    const answer = result["answer"];

    let responses = [];

    for (let i = 0; i < messages.length; i++) {
        responses.push(messages[i]);
    }
    responses.push(`The answer is: ${answer}`);

    return responses;
}

async function sendMessage(userInput, messages) {
    const logo = document.getElementById("logo");
    const homePage = document.getElementById("homePage");
    logo.style.display = "none";
    homePage.style.overflow = "auto";
    homePage.style.height = "auto";

    const text = userInput.value.trim();
    if (!text) return;
    
    addMessage(text, 'user', messages);
    userInput.value = '';

    const responses = await generateResponses(text);
    
    for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const typingIndicator = await showTyping(messages);
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        await addMessage(response, 'VAL', messages, typingIndicator);
    }
}

async function addMessage(text, sender, messages, typingIndicator) {
    if (typingIndicator) hideTyping(messages, typingIndicator);

    const message = document.createElement('div');
    message.className = `message ${sender.toLowerCase()}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.id = sender.toLowerCase();
    bubble.textContent = text;
    
    message.appendChild(bubble);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

async function showTyping(messages) {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message ai';
    typingIndicator.innerHTML = '<div class="typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
    
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



// --------------------------- LOAD PAGE --------------------------- //

document.addEventListener('DOMContentLoaded', async() => {
    const messages = document.getElementById('messages');
    const userInput = document.getElementById('mathInput');
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.addEventListener('click', async() => {
        await sendMessage(userInput, messages);
    });

    userInput.addEventListener('keypress', async(e) => {
        if (e.key === 'Enter') {
            await sendMessage(userInput, messages);
        }
    });
});