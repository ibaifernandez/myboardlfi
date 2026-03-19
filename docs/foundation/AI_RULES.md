# AI_RULES.md — Reglas persistentes para el agente de IA
> Este archivo es leído por Claude Code al inicio de cada sesión.
> Define cómo debe comportarse el agente durante todo el desarrollo de MyBoard.
> **No modificar sin consenso explícito con el owner del proyecto.**

---

## 1. Identidad del proyecto

- **Nombre:** MyBoard
- **Owner:** Ibai Fernández (info@ibaifernandez.com)
- **Fase actual:** Phase 1 — Personal Kanban (MVP)
- **Referencia de requisitos:** `PRD.md`
- **Referencia de arquitectura:** `ARCHITECTURE.md`
- **Roadmap:** `ROADMAP.md`
- **Datos reales:** `server/data/tasks.json` — NO sobreescribir nunca

---

## 2. Reglas de comportamiento del agente

### 2.1 Antes de escribir código
- Lee siempre `PRD.md` y `ARCHITECTURE.md` antes de implementar cualquier feature.
- Si algo no está especificado en el PRD, **pregunta antes de asumir**.
- Si detectas una inconsistencia entre documentos, señálala antes de continuar.

### 2.2 Confirmación por pasos
- Trabaja paso a paso siguiendo el orden definido en `CLAUDE_CODE_PROMPT.md`.
- **Confirma al completar cada paso** antes de avanzar al siguiente.
- No implementes múltiples features en una sola iteración sin aprobación.

### 2.3 Protección de datos
- El archivo `server/data/tasks.json` contiene datos reales de producción.
- **Nunca lo sobreescribas, regeneres ni lo uses como plantilla de ejemplo.**
- Si necesitas datos de prueba, úsalos en memoria o en un archivo separado (`tasks.test.json`).

### 2.4 Cambios destructivos
- Ante cualquier operación que pueda causar pérdida de datos o rotura de funcionalidad existente, **alerta primero y pide confirmación**.
- No elimines archivos ni carpetas sin confirmación explícita.
- No cambies el esquema de `tasks.json` sin avisar y acordar la migración.

---

## 3. Convenciones de código

### 3.1 General
- **Idioma del código:** inglés (variables, funciones, clases, comentarios en código).
- **Idioma de la documentación y commits:** español.
- Usa `camelCase` para variables y funciones en JavaScript.
- Usa `PascalCase` para componentes React y nombres de clases.
- Usa `kebab-case` para nombres de archivos y carpetas.
- Usa `UPPER_SNAKE_CASE` para constantes globales.

### 3.2 Frontend (React)
- Un componente por archivo. El archivo lleva el mismo nombre que el componente.
- Usa **functional components** con hooks. Nada de class components.
- Nada de `any` ni tipado implícito si se añade TypeScript en el futuro.
- Los hooks personalizados van en `client/src/hooks/` y su nombre empieza por `use`.
- Las funciones que llaman a la API van en `client/src/api/` — no hagas fetch directamente en los componentes.
- Tailwind para estilos. No CSS-in-JS, no styled-components, no módulos CSS salvo excepción justificada.

### 3.3 Backend (Express)
- Cada recurso tiene su propio archivo de rutas en `server/routes/`.
- La lógica de negocio va en `server/routes/`, no directamente en `server/index.js`.
- `server/index.js` solo configura middleware y monta rutas.
- Todas las respuestas de error devuelven JSON con formato `{ error: "mensaje" }`.
- Todas las respuestas exitosas devuelven JSON con el recurso o `{ success: true }`.
- Usa `async/await` con bloques `try/catch`. Nada de callbacks ni `.then()` encadenados.

### 3.4 Persistencia
- El único acceso al JSON es a través de dos funciones helper: `readData()` y `writeData()`.
- Estas funciones viven en `server/utils/db.js`.
- Ninguna ruta accede directamente al archivo JSON con `fs.readFileSync` o similar.

### 3.5 Estructura de IDs
- Todos los IDs son strings en formato `uuid v4`.
- Usa la librería `uuid` para generarlos en el servidor. Nunca en el cliente.

---

## 4. Gestión de errores

- El servidor siempre devuelve códigos HTTP apropiados: `200`, `201`, `400`, `404`, `500`.
- El cliente muestra un mensaje de error visible al usuario cuando una petición falla — nunca falla en silencio.
- Los errores de red se capturan en la capa `api/` del cliente y se propagan con un formato consistente.
- Nada de `console.log` en producción. Usa `console.error` solo para errores reales.

---

## 5. Lo que el agente NO debe hacer

- ❌ Instalar librerías no acordadas sin preguntar primero.
- ❌ Cambiar el stack tecnológico (React, Express, Tailwind, @dnd-kit) sin aprobación.
- ❌ Añadir features no especificadas en el PRD de Phase 1 sin consenso.
- ❌ Generar código "de ejemplo" o placeholders que después haya que reemplazar — construye con datos reales desde el inicio.
- ❌ Usar `localStorage` o `sessionStorage` para persistencia — para eso existe la API.
- ❌ Hacer commits automáticos sin confirmación.
- ❌ Modificar `AI_RULES.md`, `PRD.md`, `ARCHITECTURE.md` o `ROADMAP.md` sin instrucción explícita.

---

## 6. Dependencias aprobadas (Phase 1)

| Paquete | Versión | Propósito |
|---|---|---|
| react | ^18 | UI framework |
| react-dom | ^18 | DOM rendering |
| vite | ^5 | Build tool |
| @dnd-kit/core | latest | Drag & drop |
| @dnd-kit/sortable | latest | Ordenación en listas |
| tailwindcss | ^3 | Estilos |
| lucide-react | latest | Iconos |
| express | ^4 | Servidor HTTP |
| uuid | ^9 | Generación de IDs |
| concurrently | latest | Scripts paralelos en dev |
| cors | latest | CORS en Express |

Cualquier dependencia fuera de esta lista requiere aprobación antes de instalarla.

---

## 7. Control de versiones

- Rama principal: `main`
- Commits en español, en imperativo: "Añade componente Column", "Corrige bug en drag & drop"
- Un commit por feature o fix significativo — no commits masivos con todo mezclado.
- No pushes automáticos. El agente propone el commit, el owner confirma.
