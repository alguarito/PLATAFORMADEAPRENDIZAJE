import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const authForm = document.querySelector("#auth-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const authMessage = document.querySelector("#auth-message");
const registerButton = document.querySelector("#register-btn");
const logoutButton = document.querySelector("#logout-btn");

function showMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#b42318" : "#1d4f91";
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    showMessage("Sesion iniciada correctamente.");
    authForm.reset();
  } catch (error) {
    showMessage(`No fue posible iniciar sesion: ${error.message}`, true);
  }
});

registerButton.addEventListener("click", async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    showMessage("Cuenta creada correctamente.");
    authForm.reset();
  } catch (error) {
    showMessage(`No fue posible registrar la cuenta: ${error.message}`, true);
  }
});

logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showMessage("Sesion cerrada correctamente.");
  } catch (error) {
    showMessage(`No fue posible cerrar sesion: ${error.message}`, true);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    showMessage(`Usuario activo: ${user.email}`);
    logoutButton.style.display = "inline-flex";
  } else {
    logoutButton.style.display = "none";
  }
});
