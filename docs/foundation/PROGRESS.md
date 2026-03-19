# MyBoard — Progress Checkpoint

**Última actualización:** 2026-03-02
**Estado:** Phase 1 MVP completo ✅

---

## Pasos completados

| # | Paso | Estado | Notas |
|---|------|--------|-------|
| 1 | Setup estructura + config | ✅ | package.json raíz, vite, tailwind, proxy |
| 2 | API REST Express | ✅ | 18/18 tests en verde |
| 3 | Capa React: hooks, api/, utils | ✅ | useBoards, useBoardData, api/client.js |
| 4 | Board + Column + Card render | ✅ | 50 cards reales visibles en browser |
| 5 | CardModal (crear / editar) | ✅ | Todos los campos + mover entre columnas |
| 6 | Drag & Drop @dnd-kit | ✅ | DndContext + SortableContext + DragOverlay |
| 7 | Filtros + Sidebar navegación | ✅ | Categoría, prioridad, CRUD de boards |

---

## Arquitectura de archivos clave

```
server/
  index.js              ← rutas montadas explícitamente
  utils/db.js           ← readData / writeData (tasks.json)
  routes/boards.js      ← named exports (getBoards, createBoard…)
  routes/columns.js     ← named exports
  routes/cards.js       ← named exports + moveCard con reordenación
  data/tasks.json       ← 1 board, 5 columnas, 50 cards ← NO TOCAR

client/src/
  api/client.js         ← wrapper fetch con manejo de errores
  utils/constants.js    ← CATEGORIES, PRIORITIES (enums + colores)
  utils/dates.js        ← isOverdue, formatDate
  hooks/useBoards.js    ← CRUD boards con estado local
  hooks/useBoardData.js ← CRUD columns+cards, moveCard optimista
  components/
    Board/Board.jsx     ← DndContext, DragOverlay, modal dispatcher
    Column/Column.jsx   ← Droppable, SortableContext, inline add/rename
    Card/Card.jsx       ← presentacional (priority border, badges)
    Card/SortableCard.jsx ← useSortable wrapper
    CardModal/CardModal.jsx ← formulario completo, mover columna
    Sidebar/Sidebar.jsx ← navegación boards, inline create/rename
    Toolbar/Toolbar.jsx ← filtros categoría + prioridad
    UI/                 ← Badge, Spinner, IconButton
  App.jsx               ← orquestador principal
```

---

## Para arrancar

```bash
# Desde /Users/AGLAYA/Local Sites/MyBoard/
npm run dev
# → Server en http://localhost:3001
# → Client en http://localhost:5173
```

---

## MVP checklist Phase 1

- [x] Vista tablero con columnas y cards desde API
- [x] Drag & drop entre columnas y dentro de la misma
- [x] Modal crear/editar card (título, descripción, categoría, prioridad, fecha, tags)
- [x] Crear / renombrar / eliminar columnas
- [x] Filtro por categoría
- [x] Filtro por prioridad
- [x] Sidebar con navegación entre boards
- [x] Indicador visual de prioridad (borde izquierdo coloreado + dot)
- [x] Contador de cards por columna
- [x] Persistencia completa → tasks.json vía API
- [x] Cards vencidas marcadas en rojo (dueDate < today)

---

## Pendiente Phase 1 — smoke test manual

Verificar en browser (`http://localhost:5173`):
- [ ] Drag & drop card entre columnas → persiste en tasks.json
- [ ] Click card → modal → editar → guardar
- [ ] Crear card inline (form rápido en columna)
- [ ] Crear card desde modal (botón + en columna)
- [ ] Filtro categoría: "Music" → solo cards de música
- [ ] Filtro prioridad: "Urgent" → solo urgentes
- [ ] Crear nuevo board desde sidebar
- [ ] Renombrar/eliminar columna

---

## Phase 2 (siguiente iteración)

Ver `ROADMAP.md` — autenticación, multi-user, deploy.
