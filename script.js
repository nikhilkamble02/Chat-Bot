const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

// Function to create a chat <li> element
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent =
        className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

// Function to generate a response from the chatbot
const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
        .then((res) => res.json())
        .then((data) => {
            messageElement.textContent = data.choices[0].message.content.trim();
            // Store the chat conversation in localStorage
            updateLocalStorage();
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent =
                "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Function to handle the user's chat input
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

// Function to update the chat conversation in localStorage
const updateLocalStorage = () => {
    const chatData = chatbox.innerHTML;
    localStorage.setItem("chatConversation", chatData);
};

// Function to load the chat conversation from localStorage
const loadChatConversation = () => {
    const savedChatData = localStorage.getItem("chatConversation");
    if (savedChatData) {
        chatbox.innerHTML = savedChatData;
    }
};

// Event listeners
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
);

// Load chat conversation from localStorage when the page loads
window.addEventListener("load", () => {
    loadChatConversation();
});
