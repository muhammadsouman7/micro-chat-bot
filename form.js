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


const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");

// Sign up form submission
signUpBtn.addEventListener("click", async(event) => {
    event.preventDefault(); // Prevent default form submission
    const newUsername = document.getElementById("newUser").value;
    const newPassword = document.getElementById("newPass").value;
    const confirmPass = document.getElementById("confirmPass").value;

    // Check if passwords match
    if (newPassword !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    const userData = {
        username: newUsername,
        password: newPassword
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message); // Success message
            // Redirect to sign-in page after successful signup
            signUpForm.style.display = "none";
            signInForm.style.display = "flex";
        } else {
            alert(data.message); // Error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while signing up.');
    }
});

// Sign in form submission
signInBtn.addEventListener("click", async(event) => {
    event.preventDefault(); // Prevent default form submission
    const username = document.getElementById("userName").value;
    const password = document.getElementById("password").value;
    const userData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message); // Success message
            // Proceed with logged-in user actions
            localStorage.setItem('username', username)
            window.location.href = "micro-chat-bot.html"
        } else {
            alert(data.message); // Error message
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in.');
    }
});