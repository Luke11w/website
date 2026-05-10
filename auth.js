const API_URL = "https://elina-backend-qyad.onrender.com";

const loginPopup = document.getElementById("loginPopup");
const registerPopup = document.getElementById("registerPopup");
const successPopup = document.getElementById("successPopup");
const mainNav = document.getElementById("mainNav");
const createAccountBtn = document.getElementById("createAccountBtn");

function showMessage(text, success = true) {
  if (!successPopup) return;
  successPopup.textContent = text;
  successPopup.style.background = success ? "#f5b6c8" : "#ef4444";
  successPopup.style.color = success ? "#111" : "#fff";
  successPopup.style.display = "block";

  setTimeout(() => {
    successPopup.style.display = "none";
  }, 3000);
}

function setLoggedIn(username) {
  localStorage.setItem("elinaUser", username);

  if (!mainNav) return;

  mainNav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="shop.html">Shop</a>
    <a href="warenkorb.html">Warenkorb <b id="cartCount">0</b></a>
    <a href="#">Hi ${username} 👋</a>
    <a href="#" id="logoutBtn">Logout</a>
  `;

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem("elinaUser");
      location.reload();
    };
  }
}

async function registerUser() {
  const username = document.getElementById("usernameInput")?.value.trim();
  const email = document.querySelector("#registerPopup input[type='email']")?.value.trim();
  const password = document.getElementById("registerPassword")?.value.trim();

  if (!username || !email || !password) {
    showMessage("Bitte alles ausfüllen", false);
    return;
  }

  createAccountBtn.textContent = "Account wird erstellt...";
  createAccountBtn.disabled = true;

  try {
    const response = await fetch(API_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!data.success) {
      showMessage(data.message || "Registrieren fehlgeschlagen", false);
      return;
    }

    setLoggedIn(data.username);
    registerPopup.style.display = "none";
    showMessage("Account erfolgreich erstellt ✅", true);
  }
  catch (error) {
    showMessage("Backend nicht erreichbar", false);
  }
  finally {
    createAccountBtn.textContent = "Create Account";
    createAccountBtn.disabled = false;
  }
}

async function loginUser() {
  const email = document.querySelector("#loginPopup input[type='email']")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();
  const loginButtons = loginPopup.querySelectorAll("button");
  const loginBtn = loginButtons[loginButtons.length - 1];

  if (!email || !password) {
    showMessage("Email und Passwort eingeben", false);
    return;
  }

  loginBtn.textContent = "Login läuft...";
  loginBtn.disabled = true;

  try {
    const response = await fetch(API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!data.success) {
      showMessage(data.message || "Login fehlgeschlagen", false);
      return;
    }

    setLoggedIn(data.username);
    loginPopup.style.display = "none";
    showMessage("Login erfolgreich 🔥", true);
  }
  catch (error) {
    showMessage("Backend nicht erreichbar", false);
  }
  finally {
    loginBtn.textContent = "Login";
    loginBtn.disabled = false;
  }
}

if (createAccountBtn) {
  createAccountBtn.onclick = registerUser;
}

if (loginPopup) {
  const loginButtons = loginPopup.querySelectorAll("button");
  const loginBtn = loginButtons[loginButtons.length - 1];

  if (loginBtn) {
    loginBtn.onclick = loginUser;
  }
}

const savedUser = localStorage.getItem("elinaUser");

if (savedUser) {
  setLoggedIn(savedUser);
}