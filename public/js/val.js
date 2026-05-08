/**
 * Author: dev.slife
 * Date Created: 3/30/26
 * Date Updated: 5/7/26
 * Description:
 *      Communicates with the VAST system to handle all math logic.
 */



// ---------------------------- VAST ERRORS ---------------------------- //

class VASTError extends Error {
    // Custom Exception for VAST errors.
    constructor(message="An unexpected error occurred when using VAST.") {
        this.super(message);
        this.name = "VASTError";
    }
}

class NotEstablishedYet extends VASTError {
    // VASTError for functions or objects that haven't been established yet.
    constructor(message="Arithmetic operation not established.") {
        this.super(message);
        this.name = "NotEstablishedYet";
    }
}

class InvalidEquation extends VASTError {
    // VASTError for invalid equations that are given.
    constructor(message="The given equation is not valid.") {
        this.super(message);
        this.name = "InvalidEquation";
    }
}

class UndefinedVariable extends VASTError {
    // VASTError for undefined variables.
    constructor(message="The given variable does not have an assigned value.") {
        this.super(message);
        this.name = "UndefinedVariable";
    }
}

class InvalidType extends VASTError {
    // VASTError for invalid data types that are given.
    constructor(message="The given data type is invalid.") {
        this.super(message);
        this.name = "InvalidType";
    }
}



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

    if (result) {
        const messages = result["slm"];
        const answer = result["answer"];
        
        let responses = [];
        let steps = [];
    
        for (let i = 0; i < messages.length; i++) {
            steps.push(result["log"][i]["result"])
            responses.push(messages[i]);
        }
        responses.push(`${answer}`);
    
        return [responses, steps];
    } else {
        return [["Sorry, I ran into an unexpected error and am not able to respond to your question at the moment."], []];
    }
}

function showTyping(messages) {
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message ai";
    typingIndicator.innerHTML = "<div class='typing'><div class='dot'></div><div class='dot'></div><div class='dot'></div></div>";
    
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

async function addMessage(text, sender, typingIndicator) {
    const messages = document.getElementById("messages");
    if (typingIndicator) hideTyping(messages, typingIndicator);

    const message = document.createElement("div");
    message.className = `message ${sender.toLowerCase()}`;
    
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.id = sender.toLowerCase();
    bubble.textContent = text;
    
    const bubbleImg = document.createElement("img");
    bubbleImg.id = sender.toLowerCase();
    bubbleImg.src = (sender.toLowerCase() == "val") ? await getBlobItem("temp_val.png"): await getPFP(`${getUser()}.png`);
    
    message.appendChild(bubbleImg);
    message.appendChild(bubble);
    messages.appendChild(message);
    if (messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 5) {
        messages.scrollTop = messages.scrollHeight;
    }
}


function messageSender() {
    const userInput = document.getElementById("mathInput");
    const messages = document.getElementById("messages");
    let processing = false;
    let logoHidden = false;
    let responding = false;
    let userResponse = "";
    
    async function processMessage() {
        const text = userInput.value.trim();
        if (!text) return;
        
        userInput.value = "";
        addMessage(text, "user");
        
        if (responding) {
            userResponse = text;
            responding = false;
        } else {
            const responseData = await generateResponses(text);
            const responses = responseData[0];
            const answers = responseData[1];
    
            for (let i = 0; i < responses.length; i++) {
                const response = responses[i];
                let typingIndicator = showTyping(messages);
                await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
                addMessage(response, "VAL", typingIndicator);
                if (response.includes("?")) {
                    let attempts = 0;
                    let correct = false;

                    while (!correct && attempts < 3) {
                        responding = true;
                        while (responding) {
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }

                        const pattern = /(?:\d\w+|[\-\+\*\/\^\(\)]\s*\w+|\d+|\s*[\-\+\*\/\(\)]\s*)/gm;
                        const mathMatch = userResponse.match(pattern);
                        typingIndicator = showTyping(messages);
                        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    
                        if (mathMatch) {
                            const expression = mathMatch.join("");
                            if (expression.length != 0) {
                                console.log(answers[i], expression);
                                if (answers[i] == expression) {
                                    correct = true;
                                    addMessage("Yes, nice job!", "VAL", typingIndicator);
                                } else {
                                    addMessage("Nope, that answer doesn't seem right.", "VAL", typingIndicator)
                                }
                            } else {
                                addMessage("Hmm? Did you provide an answer?", "VAL", typingIndicator);
                            }
                        } else {
                            addMessage("Hmm? Did you provide an answer?", "VAL", typingIndicator);
                        }

                        attempts++;
                    } 
                }
            }
        }
    }

    return async function sendMessage() {        
        if (responding) {
            await processMessage();
        } else {
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
}



// --------------------------- LOAD PAGE --------------------------- //

document.addEventListener("DOMContentLoaded", async() => {
    const userInput = document.getElementById("mathInput");
    const sendBtn = document.getElementById("sendBtn");
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