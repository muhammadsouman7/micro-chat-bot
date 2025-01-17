let userQuery;
let botResponse;
const userInput = document.getElementById("userInput");
const chatFrame = document.querySelector(".chat-frame");
const sendBtn = document.getElementById("btnSend");
/* 
document.addEventListener('keydown', function(event) {
    if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
        event.preventDefault();
    }
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
}); */


async function fetchResponse(query) {
    if (!query.trim()) {
        speakResponse("Please provide a query");
        return "Please provide a query";
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/chat', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        return data.choices[0].message.content; // Process the response accordingly
    } catch (error) {
        console.error('Error:', error);
        return "Request failed";
    }
}


let currentSpeech = null; // Track the current speech synthesis instance

sendBtn.addEventListener("click", async() => {
    const userQueryValue = userInput.value.trim();
    if (!userQueryValue) return;

    // Display user's query
    const userQuery = document.createElement("div");
    userQuery.classList.add("userQuery");
    userQuery.innerHTML = userQueryValue;

    userInput.value = "";

    // Display placeholder for bot response
    const botResponse = document.createElement("div");
    botResponse.classList.add("botResponse");
    botResponse.innerHTML = "Generating...";

    chatFrame.append(userQuery);
    chatFrame.append(botResponse);

    // Fetch bot response
    const response = await fetchResponse(userQueryValue);
    botResponse.innerHTML = response;

    // If there's an ongoing speech, stop it
    if (currentSpeech) {
        window.speechSynthesis.cancel(); // Stop any current speech
    }

    // Initialize speech synthesis for the new response
    const synth = window.speechSynthesis;
    const voice = new SpeechSynthesisUtterance(response);

    // Ensure voices are loaded
    const loadVoices = () =>
        new Promise((resolve) => {
            let voices = synth.getVoices();
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


const speakBtn = document.getElementById('btnSpeak');
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