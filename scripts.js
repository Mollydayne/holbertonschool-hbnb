// === Constantes d'URL ===
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';
const LOGIN_API_URL = `${API_BASE_URL}/auth/login`;
const INDEX_PAGE_URL = 'index.html';

// === Gestion des cookies ===
function setAuthCookie(token) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    document.cookie = `token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
}

function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// === Affichage erreur ===
function displayError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert(message);
    }
}

// === Soumission du formulaire de login ===
async function loginRequest(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const email = emailInput?.value;
    const password = passwordInput?.value;

    if (!email || !password) {
        displayError('Please enter both email and password.');
        return;
    }

    try {
        const response = await fetch(LOGIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.access_token) {
            setAuthCookie(data.access_token);
            window.location.href = INDEX_PAGE_URL;
        } else {
            displayError(data.message || 'Login failed. Please check your credentials.');
        }

    } catch (error) {
        console.error('Login error:', error);
        displayError('An error occurred. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginRequest);
    }

    const loginButton = document.querySelector('.login-button');
    const token = getCookie('token');
    if (loginButton) {
        loginButton.style.display = token ? 'none' : 'block';
    }
});
