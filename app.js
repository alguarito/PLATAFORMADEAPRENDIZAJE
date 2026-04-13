import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const authForm = document.querySelector("#auth-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const roleInput = document.querySelector("#role");
const authMessage = document.querySelector("#auth-message");
const registerButton = document.querySelector("#register-btn");
const logoutButton = document.querySelector("#logout-btn");
const loginButton = document.querySelector('button[data-mode="login"]');

function showMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#b42318" : "#1d4f91";
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const credentials = getFormCredentials({ requireRole: false });
  if (!credentials) return;
  setAuthLoading(true);
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    showMessage("Sesion iniciada correctamente.");
    await redirectToDashboard(credential.user.uid);
  } catch (error) {
    showMessage(`No fue posible iniciar sesion: ${error.message}`, true);
  } finally {
    setAuthLoading(false);
  }
});

registerButton.addEventListener("click", async () => {
  const credentials = getFormCredentials({ requireRole: true });
  if (!credentials) return;
  setAuthLoading(true);
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    try {
      await setDoc(doc(db, "users", credential.user.uid), {
        email: credentials.email,
        role: credentials.role,
        createdAt: serverTimestamp()
      });
    } catch (profileError) {
      showMessage(
        `La cuenta se creo, pero no se guardo el perfil: ${profileError.message}`,
        true
      );
      return;
    }
    showMessage("Cuenta creada correctamente. Redirigiendo...");
    await redirectToDashboard(credential.user.uid);
  } catch (error) {
    showMessage(`No fue posible registrar la cuenta: ${error.message}`, true);
  } finally {
    setAuthLoading(false);
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

onAuthStateChanged(auth, async (user) => {
  if (user) {
    showMessage(`Usuario activo: ${user.email}`);
    logoutButton.style.display = "inline-flex";
    await redirectToDashboard(user.uid);
  } else {
    logoutButton.style.display = "none";
  }
});

async function redirectToDashboard(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (!userDoc.exists()) {
      showMessage("Tu cuenta no tiene rol asignado. Contacta al administrador.", true);
      return;
    }
    const role = userDoc.data().role;
    window.location.href = `./dashboard.html?role=${encodeURIComponent(role)}`;
  } catch (error) {
    showMessage(`No fue posible validar tu perfil: ${error.message}`, true);
  }
}

function getFormCredentials({ requireRole }) {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const role = roleInput.value;
  if (!email || !password) {
    showMessage("Completa correo y contrasena antes de continuar.", true);
    return null;
  }
  if (password.length < 6) {
    showMessage("La contrasena debe tener al menos 6 caracteres.", true);
    return null;
  }
  if (requireRole && !role) {
    showMessage("Debes seleccionar un rol antes de registrarte.", true);
    return null;
  }
  return { email, password, role };
}

function setAuthLoading(isLoading) {
  loginButton.disabled = isLoading;
  registerButton.disabled = isLoading;
  loginButton.textContent = isLoading ? "Procesando..." : "Iniciar sesion";
  registerButton.textContent = isLoading ? "Procesando..." : "Registrarse";
}
