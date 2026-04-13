# ConectaTE - Inicio MVP

Base inicial del servicio web para la Institucion Educativa Sor Maria Juliana.

## Incluye

- Pagina de inicio responsive.
- Header con boton `Login` en esquina superior derecha.
- Secciones bilingues (espanol/ingles) en el bloque principal.
- Footer con firma: `PhD. Alvaro Cardenas Orozco`.
- Punto de preparacion para Firebase en `firebase-config.example.js`.

## Estructura

- `index.html`: pagina de inicio.
- `styles.css`: estilos responsive.
- `app.js`: comportamiento inicial del login.
- `firebase-config.example.js`: plantilla de configuracion Firebase.

## Siguiente paso (Firebase)

1. Crear proyecto Firebase.
2. Copiar `firebase-config.example.js` a `firebase-config.js`.
3. Reemplazar claves por las del proyecto.
4. Habilitar `Email/Password` en Firebase Authentication.

## Ejecucion local

Para probar autenticacion con modulos ES, ejecuta con servidor local:

- `python3 -m http.server 5500`
- luego abre `http://localhost:5500`

## Modulos MVP recomendados (3)

1. **Autenticacion y perfiles por rol** (estudiante, docente, acudiente, admin).
2. **Comunicados y circulares** con filtros por rol/curso.
3. **Tareas y seguimiento academico** (publicar, entregar, estado).
