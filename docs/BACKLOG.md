# BACKLOG — MyBoardLFi

Registro granular de tareas por fase. Actualizar al completar o añadir ítems.

---

## Phase 0 — Limpieza y preparación *(En curso)*

- [x] Backup de `tasks.json` original → `tasks.personal-backup.json`
- [x] Limpiar datos personales de `tasks.json`
- [x] Cargar dummy data corporativa (5 tableros, 30+ tarjetas, 8 categorías)
- [x] Borrar archivos en `server/uploads/` (adjuntos personales)
- [x] Borrar `estrategia.ibaifernandez.com.md` de la raíz
- [x] Limpiar `.env` — eliminar credenciales personales, añadir `PORT=3003`
- [x] Actualizar `.claude/launch.json` → puertos 3003/5175
- [x] Actualizar `client/vite.config.js` → puerto 5175, proxy a 3003
- [x] Actualizar `server/index.js` → `PORT = process.env.PORT || 3003`
- [x] Reescribir `CLAUDE.md` con contexto MyBoardLFi
- [x] Reescribir `AGENTS.md` con contexto MyBoardLFi
- [x] Reescribir `README.md` orientado a gerencia LFi + equipo técnico
- [x] Reescribir `docs/ROADMAP.md` con 4 fases corporativas
- [x] Reescribir `docs/BACKLOG.md`
- [x] Reescribir `docs/ARCHITECTURE.md` con visión Phase 1+
- [x] Reescribir `docs/DECISIONS.md` con decisiones LFi
- [x] Reescribir `docs/PRODUCT.md` orientado a stakeholders LFi
- [x] Añadir entrada en `docs/CHANGELOG.md` — Sesión 0

---

## Phase 1 — Multi-tenant y autenticación *(En curso)*

### Base de datos ✅
- [x] Diseño del esquema completo en Supabase: `organizations`, `users`, `boards`, `columns`, `cards`, `categories`
- [x] Crear proyecto en Supabase (`myboardlfi`, región São Paulo, plan free)
- [x] Ejecutar schema SQL inicial con RLS activado
- [x] Insertar organización LFi Agency como tenant base

### Autenticación ✅
- [x] Integrar Supabase Auth + cliente admin en servidor
- [x] Endpoint `POST /api/auth/register` (con validación de dominio corporativo)
- [x] Endpoint `POST /api/auth/login`
- [x] Endpoint `GET /api/auth/me`
- [x] Middleware `requireAuth` (JWT) para rutas protegidas
- [x] Middleware `requireRole(...roles)` para rutas por rol
- [x] Restricción de dominio: solo `@lfi.la` y `@lafabricaimaginaria.com`
- [x] Usuario superadmin creado: `ibai@lfi.la`

### Frontend — Autenticación ✅
- [x] `AuthContext` con token + user en localStorage
- [x] Pantalla de login con logo LFi y validación de dominio
- [x] Flujo "Olvidé mi contraseña" integrado (Supabase Auth)
- [x] Página `/reset-password` para restablecimiento de contraseña
- [x] Interceptor JWT en `api/client.js`
- [x] Gate de autenticación en `App.jsx`
- [x] Avatar + nombre de usuario + logout en Toolbar

### Branding ✅
- [x] Logo LFi en login, sidebar y reset de contraseña
- [x] Email digest rebrandeado a MyBoardLFi

### Email ✅ (parcial)
- [x] Endpoint `POST /api/digest/send-me` (requiere auth)
- [x] Botón "Enviarme mis tareas" en Toolbar con feedback visual
- [x] SMTP funcional (Migadu provisional)
- [ ] ⚠️ Migrar SMTP a Resend (`lafabricaimaginaria.com`) — pendiente Fernando Murillo
- [ ] Templates de email Supabase personalizados (reset password, invite)

### Seguridad
- [x] Claves Supabase service_role solo en servidor
- [x] Validación de dominio en doble capa (frontend + servidor)
- [ ] Security headers HTTP (helmet)
- [ ] Auditoría completa de superficie de ataque

### Multi-tenancy
- [ ] Migrar rutas boards/columns/cards de `tasks.json` → Supabase
- [ ] Filtrar datos por `organizationId` en todas las queries
- [ ] Endpoint `POST /api/organizations`
- [ ] Endpoint `GET /api/organizations/:id/members`

### Roles y permisos
- [ ] Permisos por tablero: owner / editor / viewer
- [ ] Panel de administración (crear/gestionar usuarios)

### Freemium
- [ ] Middleware de límites: máx. 3 tableros y 50 tarjetas en plan free
- [ ] UI de aviso cuando se alcanza el límite

### QA y documentación
- [ ] `docs/QA-DESKTOP.md` — checklist funcional, accesibilidad, seguridad, rendimiento
- [ ] `docs/QA-MOBILE.md` — checklist mobile + estado de responsividad
- [ ] `docs/README-deploy.md` — instrucciones para Fernando Murillo / PRONODO

---

## Phase 2 — Deploy en PRONODO *(Planificado)*

- [ ] `Dockerfile` para el server Express
- [ ] `Dockerfile` para el client (build Vite + nginx)
- [ ] `docker-compose.yml` (server + client + proxy)
- [ ] Configurar variables de entorno de producción
- [ ] Acordar dominio con Fernando Murillo (PRONODO)
- [ ] Configurar HTTPS / SSL
- [ ] Primer deploy en PRONODO
- [ ] `docs/README-deploy.md` para el equipo técnico
- [ ] CI/CD básico (GitHub Actions: build + test en push a main)

---

## Phase 3 — Pitch interno a LFi *(Pendiente de Phase 1)*

- [ ] Demo funcional en dominio de PRONODO
- [ ] Deck de presentación (5–6 slides)
- [ ] Propuesta comercial redactada
- [ ] Reunión con Héctor Vera e Iván Colodro
- [ ] Reunión con Daniel y Marco
