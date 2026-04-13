const params = new URLSearchParams(window.location.search);
const grade = params.get("grade") || "octavo";
const period = params.get("period") || "1";
const session = params.get("session") || "1";

const metaElement = document.querySelector("#session-meta");
const titleElement = document.querySelector("#session-title");
const contentElement = document.querySelector("#session-content");

metaElement.textContent = `Grado ${capitalize(grade)} - Periodo ${period} - Sesion ${session}`;
titleElement.textContent = `Contenido de la sesion ${session}`;

const contentPath = `./contenidos/${grade}/periodo-${period}/sesion-${session}.md`;

loadSessionContent();

async function loadSessionContent() {
  try {
    const response = await fetch(contentPath);
    if (!response.ok) {
      throw new Error("Contenido no disponible");
    }
    const markdown = await response.text();
    contentElement.innerHTML = renderMarkdown(markdown);
  } catch (_error) {
    contentElement.innerHTML = `
      <p>No encontramos contenido para esta sesion todavia.</p>
      <p>Ruta buscada: <code>${contentPath}</code></p>
    `;
  }
}

function renderMarkdown(markdown) {
  const safe = escapeHtml(markdown);
  return safe
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^- (.*$)/gim, "<li>$1</li>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^(?!<h1|<h2|<h3|<li|<\/p>)(.+)$/gim, "<p>$1</p>")
    .replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>")
    .replace(/<ul>\s*<\/ul>/g, "");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
