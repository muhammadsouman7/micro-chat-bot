let userQuery;
let botResponse;
const userInput = document.getElementById("userInput");
const chatFrame = document.querySelector(".chat-frame");
const sendBtn = document.getElementById("btnSend");
const speakBtn = document.getElementById("btnSpeak");

/* // Prevent opening developer tools and right-click menu
document.addEventListener('keydown', function(event) {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
    }
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});
 */
// Fetch response from API
async function fetchResponse(query) {
    if (!query.trim()) {
        speakResponse("Please provide a query");
        return "Please provide a query";
    }

    const url = "https://openrouter.ai/api/v1/chat/completions";
    const apiKey = "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";

    const payload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: query }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error(`Request failed: ${error}`);
        return "Request failed";
    }
}

let currentSpeech = null; // Track the current speech synthesis instance

sendBtn.addEventListener("click", async() => {
    const userQueryValue = userInput.value.trim();
    if (!userQueryValue) return;

    // Display user's query
    userQuery = document.createElement("div");
    userQuery.classList.add("userQuery");
    userQuery.innerHTML = userQueryValue;

    userInput.value = "";

    // Display placeholder for bot response
    botResponse = document.createElement("div");
    botResponse.classList.add("botResponse");
    botResponse.innerHTML = "Generating...";

    chatFrame.append(userQuery);
    chatFrame.append(botResponse);

    // Fetch bot response
    const response = await fetchResponse(userQueryValue);
    botResponse.innerHTML = response;

    // Stop current speech if ongoing
    if (currentSpeech) {
        window.speechSynthesis.cancel();
    }

    // Initialize speech synthesis for the new response
    const synth = window.speechSynthesis;
    const voice = new SpeechSynthesisUtterance(response);

    // Ensure voices are loaded
    const loadVoices = () =>
        new Promise((resolve) => {
            const voices = synth.getVoices();
            if (voices.length) {
                resolve(voices);
            } else {
                synth.addEventListener("voiceschanged", () => resolve(synth.getVoices()));
            }
        });

    const availableVoices = await loadVoices();
    const selectedVoice =
        availableVoices.find((v) => v.name.includes("Google UK English Female")) ||
        availableVoices[0]; // Fallback to the first available voice

    voice.voice = selectedVoice;
    voice.rate = 1.2;

    // Track the current speech instance
    currentSpeech = voice;

    synth.speak(voice);
});

// Speech-to-text functionality
const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = true;

recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
    userInput.value = transcript; // Use .value for input or textarea elements
};

recognition.onerror = (event) => {
    console.error('Error occurred:', event.error);
};

recognition.onspeechend = () => {
    console.log('Speech has ended.');
    recognition.stop();
};

speakBtn.addEventListener('click', () => {
    recognition.start();
    console.log('Recognition started.');
});