# Prompt de arranque — MyBoard Phase 1
> Copia y pega este prompt al inicio de tu sesión en Claude Code.

---

## PROMPT

Quiero construir una aplicación web de gestión de tareas tipo kanban llamada **MyBoard**. Es un proyecto personal que en el futuro escalaré a infraestructura empresarial, así que el código debe ser limpio, modular y fácil de extender.

### Stack decidido
- **Frontend:** React 18 + Vite
- **Backend:** Express.js (Node)
- **Datos:** archivo `server/data/tasks.json` (persistencia local)
- **Drag & Drop:** @dnd-kit/core
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React

### Estructura de carpetas objetivo

```
myboard/
├── client/                   # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board/
│   │   │   ├── Column/
│   │   │   ├── Card/
│   │   │   ├── CardModal/
│   │   │   └── Sidebar/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.js
├── server/
│   ├── routes/
│   │   ├── boards.js
│   │   ├── columns.js
│   │   └── cards.js
│   ├── data/
│   │   └── tasks.json        ← YA EXISTE, no lo sobreescribas
│   └── index.js
├── package.json              # scripts raíz con concurrently
└── README.md
```

### IMPORTANTE: el archivo tasks.json ya existe
En `server/data/tasks.json` ya tengo mis datos reales cargados (50 tareas personales organizadas en boards, columns y cards). **No lo sobreescribas ni generes datos de ejemplo.** La app debe leer desde ese archivo desde el primer arranque.

### Esquema de datos (el JSON ya lo respeta)

**Board:** `{ id, title, createdAt }`
**Column:** `{ id, boardId, title, order }`
**Card:** `{ id, columnId, boardId, title, description, category, priority, dueDate, tags, createdAt, updatedAt, order }`

**Categorías (enum):** `music`, `projects`, `travel`, `health`, `finance`, `shopping`, `tech`, `personal`
**Prioridades (enum):** `low`, `medium`, `high`, `urgent`

### API REST a implementar

**Boards:**
- `GET /api/boards`
- `POST /api/boards`
- `PUT /api/boards/:id`
- `DELETE /api/boards/:id`

**Columns:**
- `GET /api/boards/:boardId/columns`
- `POST /api/boards/:boardId/columns`
- `PUT /api/columns/:id`
- `DELETE /api/columns/:id`

**Cards:**
- `GET /api/boards/:boardId/cards`
- `GET /api/columns/:columnId/cards`
- `POST /api/cards`
- `PUT /api/cards/:id`
- `PUT /api/cards/:id/move` — cambio de columna + reordenación
- `DELETE /api/cards/:id`

### Funcionalidades MVP (Phase 1)

1. Vista de tablero con columnas y cards renderizadas desde la API
2. Drag & drop de cards entre columnas y dentro de la misma columna (con @dnd-kit)
3. Modal para crear / editar card (todos los campos: título, descripción, categoría, prioridad, fecha límite, tags)
4. Crear / editar / eliminar columnas
5. Filtro por categoría (selector en la barra superior)
6. Filtro por prioridad
7. Sidebar con lista de tableros y navegación entre ellos
8. Indicador visual de prioridad en cada card (borde de color o badge)
9. Contador de cards por columna
10. Persistencia completa: todos los cambios se escriben al JSON vía API

### UI / UX

- Diseño limpio, oscuro o claro a tu criterio (que sea bonito y profesional)
- Sin animaciones innecesarias — el drag & drop ya tiene la suya
- Cards compactas: título visible + badge de categoría + indicador de prioridad
- Si la card tiene fecha de vencimiento vencida, marcarla visualmente en rojo

### Scripts de arranque

El `package.json` raíz debe tener:
```json
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "node server/index.js",
  "client": "cd client && npm run dev"
}
```

El servidor Express en el puerto `3001`, Vite en el puerto `5173`.
Configurar proxy en `vite.config.js` para que `/api` apunte a `localhost:3001`.

### Lo que NO entra en Phase 1
- Autenticación / multi-usuario
- Deploy remoto
- Integración con IA
- Adjuntos en cards
- Notificaciones

### Orden de implementación sugerido

1. Setup del proyecto (raíz, server, client)
2. Server Express con lectura/escritura del JSON y todos los endpoints
3. Estructura base de React con Tailwind
4. Componente Board + Column + Card (solo render, sin drag aún)
5. Integración con API (fetch de datos reales)
6. CardModal (crear / editar)
7. Drag & Drop con @dnd-kit
8. Filtros por categoría y prioridad
9. Sidebar con navegación
10. Polish visual final

---

Empieza por el paso 1: crea la estructura de carpetas y los archivos de configuración base (package.json raíz, server/index.js esqueleto, client con Vite + React + Tailwind). Confirma antes de avanzar al paso 2.
