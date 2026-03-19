# MyBoard — Product Requirements Document
**Phase 1 · Personal Kanban**
**Owner:** Ibai Fernández · info@ibaifernandez.com
**Fecha:** 2026-03-02
**Estado:** Ready for development

---

## 1. Visión del producto

MyBoard es una aplicación web de gestión de tareas tipo kanban, construida desde cero, sin dependencia de servicios de terceros. Nace como herramienta personal y está diseñada para escalar a infraestructura empresarial en fases posteriores.

**Principios de diseño:**
- Zero vendor lock-in. Todo el código y los datos son del propietario.
- Data-first: los datos viven en un archivo JSON local, fácil de migrar a cualquier base de datos.
- UI limpia y funcional, sin ruido visual.
- Arquitectura modular: cada capa (UI, API, datos) es independiente y sustituible.

---

## 2. Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Backend | Express.js (Node) |
| Datos (local) | `data/tasks.json` |
| Drag & Drop | @dnd-kit/core |
| Estilos | Tailwind CSS |
| Iconos | Lucide React |

---

## 3. Estructura de datos

### Board
```json
{
  "id": "string (uuid)",
  "title": "string",
  "createdAt": "ISO date"
}
```

### Column
```json
{
  "id": "string (uuid)",
  "boardId": "string",
  "title": "string",
  "order": "number"
}
```

### Card
```json
{
  "id": "string (uuid)",
  "columnId": "string",
  "boardId": "string",
  "title": "string",
  "description": "string",
  "category": "string (enum)",
  "priority": "low | medium | high | urgent",
  "dueDate": "ISO date | null",
  "tags": ["string"],
  "createdAt": "ISO date",
  "updatedAt": "ISO date",
  "order": "number"
}
```

### Categories (enum fijo en Phase 1)
- `music` — Música / DJ Amapola
- `projects` — Proyectos digitales
- `travel` — Viajes & Trámites
- `health` — Salud & Bienestar
- `finance` — Finanzas
- `shopping` — Compras
- `tech` — Tecnología
- `personal` — Personal

---

## 4. Estructura de carpetas del proyecto

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
│   │   ├── api/              # funciones fetch al servidor
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── vite.config.js
├── server/                   # Express.js
│   ├── routes/
│   │   ├── boards.js
│   │   ├── columns.js
│   │   └── cards.js
│   ├── data/
│   │   └── tasks.json        # fuente de verdad local
│   └── index.js
├── package.json              # scripts para arrancar ambos
└── README.md
```

---

## 5. API REST (Phase 1)

### Boards
- `GET /api/boards` — listar tableros
- `POST /api/boards` — crear tablero
- `PUT /api/boards/:id` — editar tablero
- `DELETE /api/boards/:id` — eliminar tablero

### Columns
- `GET /api/boards/:boardId/columns` — listar columnas de un tablero
- `POST /api/boards/:boardId/columns` — crear columna
- `PUT /api/columns/:id` — editar columna (incluye reordenación)
- `DELETE /api/columns/:id` — eliminar columna

### Cards
- `GET /api/columns/:columnId/cards` — listar cards de una columna
- `GET /api/boards/:boardId/cards` — todas las cards de un tablero (para filtros)
- `POST /api/cards` — crear card
- `PUT /api/cards/:id` — editar card (incluye cambio de columna = mover)
- `DELETE /api/cards/:id` — eliminar card
- `PUT /api/cards/:id/move` — mover card (cambio de columna + reordenación)

---

## 6. Funcionalidades Phase 1

### Must have (MVP)
- [ ] Vista de tablero con columnas y cards
- [ ] Drag & drop de cards entre columnas
- [ ] Drag & drop para reordenar cards dentro de una columna
- [ ] Crear / editar / eliminar cards
- [ ] Modal de card con todos los campos (título, descripción, categoría, prioridad, fecha límite, tags)
- [ ] Crear / editar / eliminar columnas
- [ ] Filtro por categoría
- [ ] Filtro por prioridad
- [ ] Persistencia completa vía API + JSON
- [ ] Sidebar con navegación entre tableros

### Should have (Phase 1, si el tiempo lo permite)
- [ ] Búsqueda global de cards
- [ ] Vista de card expandida (sin modal, panel lateral)
- [ ] Contador de cards por columna
- [ ] Indicador visual de prioridad en la card (color de borde o badge)
- [ ] Fecha de vencimiento con alerta visual si está vencida

### Won't have (Phase 1)
- Autenticación / usuarios múltiples
- Tiempo real / websockets
- Adjuntos / imágenes en cards
- Integración con IA
- Notificaciones
- Deploy en servidor remoto

---

## 7. Columnas por defecto (tablero personal)

| Orden | Título | Descripción |
|---|---|---|
| 1 | 🗂 Backlog | Todo lo que está pendiente y no tiene urgencia inmediata |
| 2 | 🎯 Esta semana | Tareas activas para la semana en curso |
| 3 | 🔄 En curso | Lo que estás haciendo ahora mismo |
| 4 | ⏸ Bloqueado | En espera de algo externo |
| 5 | ✅ Hecho | Completado (se puede archivar periódicamente) |

---

## 8. Scripts de arranque

```bash
# Instalar dependencias (raíz + client)
npm install && cd client && npm install

# Arrancar en desarrollo (servidor + cliente simultáneos)
npm run dev

# Build de producción del cliente
npm run build
```

El script `npm run dev` en raíz debe usar `concurrently` para levantar Express en puerto 3001 y Vite en puerto 5173 al mismo tiempo.

---

## 9. Criterios de aceptación del MVP

- [ ] La app arranca con `npm run dev` sin errores
- [ ] Los datos persisten entre reinicios del servidor
- [ ] El drag & drop funciona en desktop (mouse)
- [ ] Se puede crear una card completa en menos de 30 segundos
- [ ] Filtrar por categoría oculta las cards que no corresponden
- [ ] El JSON se puede leer y editar manualmente sin romper la app
