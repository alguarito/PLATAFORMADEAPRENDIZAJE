import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const roleElement = document.querySelector("#dashboard-role");
const emailElement = document.querySelector("#dashboard-email");
const messageElement = document.querySelector("#dashboard-message");
const logoutButton = document.querySelector("#logout-btn");
const comunicadoForm = document.querySelector("#comunicado-form");
const comunicadoTitle = document.querySelector("#comunicado-title");
const comunicadoContent = document.querySelector("#comunicado-content");
const comunicadoStatus = document.querySelector("#comunicado-status");
const comunicadosList = document.querySelector("#comunicados-list");
const studentWall = document.querySelector("#student-wall");
const gradeSelector = document.querySelector("#grade-selector");
const periodSelector = document.querySelector("#period-selector");
const sessionGrid = document.querySelector("#session-grid");

let currentRole = null;
let currentEmail = null;
let selectedGrade = "octavo";
let selectedPeriod = "1";

const grades = [
  { key: "octavo", label: "Octavo" },
  { key: "noveno", label: "Noveno" },
  { key: "decimo", label: "Decimo" },
  { key: "undecimo", label: "Undecimo" }
];

const periods = [
  { key: "1", label: "Periodo 1" },
  { key: "2", label: "Periodo 2" },
  { key: "3", label: "Periodo 3" }
];

logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "./index.html";
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./index.html";
    return;
  }

  emailElement.textContent = `Usuario: ${user.email}`;
  currentEmail = user.email ?? "sin correo";
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    roleElement.textContent = "Sin rol";
    messageElement.textContent =
      "No encontramos rol asignado en Firestore. Contacta al administrador.";
    return;
  }

  const role = userDoc.data().role ?? "sin rol";
  currentRole = role;
  roleElement.textContent = role;
  messageElement.textContent = roleMessage(role);
  configureStudentWall(role);
  configureComunicadoForm(role);
  listenComunicados();
});

comunicadoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canPublish(currentRole)) {
    setComunicadoStatus("Tu rol no tiene permisos para publicar comunicados.", true);
    return;
  }
  try {
    await addDoc(collection(db, "comunicados"), {
      title: comunicadoTitle.value.trim(),
      content: comunicadoContent.value.trim(),
      authorEmail: currentEmail,
      authorRole: currentRole,
      createdAt: serverTimestamp()
    });
    comunicadoForm.reset();
    setComunicadoStatus("Comunicado publicado correctamente.");
  } catch (error) {
    setComunicadoStatus(`Error al publicar: ${error.message}`, true);
  }
});

function roleMessage(role) {
  switch (role) {
    case "estudiante":
      return "Aqui veras tus tareas, comunicados y progreso academico.";
    case "docente":
      return "Aqui podras gestionar tareas, cursos y comunicados a estudiantes.";
    case "acudiente":
      return "Aqui consultaras seguimiento academico y avisos institucionales.";
    case "admin":
      return "Aqui administraras usuarios, roles y configuracion general.";
    default:
      return "Rol no reconocido. Solicita revision al administrador.";
  }
}

function canPublish(role) {
  return role === "admin" || role === "docente";
}

function configureComunicadoForm(role) {
  if (canPublish(role)) {
    comunicadoForm.style.display = "grid";
    setComunicadoStatus("Puedes publicar comunicados para la comunidad.");
  } else {
    comunicadoForm.style.display = "none";
    setComunicadoStatus("Tu rol puede consultar comunicados, pero no publicarlos.");
  }
}

function setComunicadoStatus(message, isError = false) {
  comunicadoStatus.textContent = message;
  comunicadoStatus.style.color = isError ? "#b42318" : "#1d4f91";
}

function configureStudentWall(role) {
  if (role !== "estudiante") {
    studentWall.style.display = "none";
    return;
  }
  studentWall.style.display = "block";
  renderGradeSelector();
  renderPeriodSelector();
  renderSessionGrid();
}

function renderGradeSelector() {
  gradeSelector.innerHTML = "";
  grades.forEach((grade) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip-btn${grade.key === selectedGrade ? " active" : ""}`;
    button.textContent = grade.label;
    button.addEventListener("click", () => {
      selectedGrade = grade.key;
      renderGradeSelector();
      renderSessionGrid();
    });
    gradeSelector.appendChild(button);
  });
}

function renderPeriodSelector() {
  periodSelector.innerHTML = "";
  periods.forEach((period) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip-btn${period.key === selectedPeriod ? " active" : ""}`;
    button.textContent = period.label;
    button.addEventListener("click", () => {
      selectedPeriod = period.key;
      renderPeriodSelector();
      renderSessionGrid();
    });
    periodSelector.appendChild(button);
  });
}

function renderSessionGrid() {
  sessionGrid.innerHTML = "";
  for (let session = 1; session <= 12; session += 1) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "session-btn";
    button.textContent = `Sesion ${session}`;
    button.addEventListener("click", () => {
      alert(
        `Abrir contenido -> Grado: ${selectedGrade}, Periodo: ${selectedPeriod}, Sesion: ${session}`
      );
    });
    sessionGrid.appendChild(button);
  }
}

function listenComunicados() {
  const comunicadosQuery = query(
    collection(db, "comunicados"),
    orderBy("createdAt", "desc")
  );
  onSnapshot(comunicadosQuery, (snapshot) => {
    comunicadosList.innerHTML = "";
    if (snapshot.empty) {
      comunicadosList.innerHTML = "<p>Aun no hay comunicados publicados.</p>";
      return;
    }

    snapshot.forEach((item) => {
      const comunicado = item.data();
      const wrapper = document.createElement("article");
      wrapper.className = "comunicado-item";
      const createdAt = comunicado.createdAt?.toDate
        ? comunicado.createdAt.toDate().toLocaleString("es-CO")
        : "fecha pendiente";
      wrapper.innerHTML = `
        <h3>${escapeHtml(comunicado.title || "Sin titulo")}</h3>
        <p>${escapeHtml(comunicado.content || "")}</p>
        <p class="comunicado-meta">Publicado por ${escapeHtml(comunicado.authorEmail || "usuario")} (${escapeHtml(comunicado.authorRole || "sin rol")}) - ${createdAt}</p>
      `;
      comunicadosList.appendChild(wrapper);
    });
  });
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
