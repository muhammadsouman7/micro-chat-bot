var userLabel = document.getElementById("userLabel")
var username = document.getElementById("userName")
var passLabel = document.getElementById("passLabel")
var password = document.getElementById("password")
username.addEventListener("click", () => {
    userLabel.classList.add("active");
})

password.addEventListener("click", () => {
    passLabel.classList.add("active")
})

var newUserLabel = document.getElementById("newUserLabel")
var newUsername = document.getElementById("newUser")
var newPassLabel = document.getElementById("newPassLabel")
var newPassword = document.getElementById("newPass")
var confirmPassLabel = document.getElementById("confirmPassLabel");
var confirmPass = document.getElementById("confirmPass")

newUsername.addEventListener("click", () => {
    newUserLabel.classList.add("active");
})

newPassword.addEventListener("click", () => {
    newPassLabel.classList.add("active");
})

confirmPass.addEventListener("click", () => {
    confirmPassLabel.classList.add("active");

})


const signUpForm = document.getElementById('signup-form');
const signInForm = document.getElementById('signin-form');
const formContainer = document.querySelector('.form-container');
const signUp = document.getElementById("signUp")
signUp.addEventListener("click", () => {
    formContainer.classList.add('active');
    userLabel.classList.remove("active");
    passLabel.classList.remove("active")
    username.value = ""
    password.value = ""
    setTimeout(() => {
        signInForm.style.display = "none"
        signUpForm.style.display = "flex"
    }, 300);
})
const signIn = document.getElementById("signIn")
signIn.addEventListener("click", () => {
    newUserLabel.classList.remove("active");
    newPassLabel.classList.remove("active");
    newUsername.value = ""
    newPassword.value = ""
    setTimeout(() => {
        formContainer.classList.remove('active');
        signInForm.style.display = "flex"
        signUpForm.style.display = "none"
    }, 300);
})


const signInBtn = document.getElementById("signInBtn")
const signUpBtn = document.getElementById("signUpBtn")

signUpBtn.addEventListener("click", () => {
    const username = document.getElementById('newUser').value;
    const password = document.getElementById('newPass').value;
    const confirmPassword = document.getElementById('confirmPass').value;

    if (!username || !password || !confirmPassword) {
        alert('Please fill in all fields!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Store user credentials in localStorage (simple approach)
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    alert('Signup successful! Please login.');
    document.getElementById('signUpForm').reset();
})
signInBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    const username = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    // Retrieve stored credentials from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
        window.location.href = "micro-chat-bot.html";
    } else {
        alert('Invalid username or password!');
    }
});