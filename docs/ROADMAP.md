# MyBoardLFi — Roadmap de desarrollo

**Última actualización:** 2026-03-18

---

## Phase 0 — Limpieza y preparación

**Estado:** 🔄 En curso
**Semana:** 18/03/2026

### Objetivos
- Eliminar todos los datos personales de Ibai del repositorio
- Cargar dummy data corporativa verosímil para LFi
- Actualizar puertos a 3003 (server) y 5175 (client)
- Reescribir toda la documentación con contexto corporativo
- Establecer las bases para el desarrollo de Phase 1

### Entregables
- [x] Backup de `tasks.json` original
- [x] Dummy data corporativa en `tasks.json` (5 tableros, 30+ tarjetas)
- [x] Archivos personales eliminados (uploads, estrategia.md, .env)
- [x] Puertos actualizados (3003/5175)
- [x] CLAUDE.md, AGENTS.md, README.md reescritos
- [x] ROADMAP.md, BACKLOG.md, ARCHITECTURE.md, DECISIONS.md, PRODUCT.md reescritos

---

## Phase 1 — Multi-tenant y autenticación

**Estado:** 📋 Planificado
**Estimado:** 1–2 semanas tras Phase 0

### Objetivos
- Convertir la aplicación de single-user a multi-tenant
- Implementar autenticación segura con JWT
- Migrar el almacenamiento de JSON a base de datos real
- Establecer sistema de roles y permisos

### Funcionalidades
- Sistema de login y registro con Supabase Auth
- Endpoints `/api/auth/login` y `/api/auth/register`
- Middleware de autenticación JWT en todas las rutas protegidas
- Campo `organizationId` en boards y cards (aislamiento por tenant)
- Roles: superadmin / admin / colaborador / cliente / guest
- Permisos por tablero: owner / editor / viewer
- Panel de administración: gestión de usuarios y roles
- Límites freemium: Free (3 tableros, 50 tarjetas, sin colaboradores) vs. Pro (sin límites)
- Migración completa de `tasks.json` a Supabase

### Tablas de base de datos (Supabase/PostgreSQL)
- `organizations` — tenants
- `users` — vinculados a Supabase Auth
- `memberships` — relación usuarios ↔ organizaciones + rol
- `boards` — con `organization_id`
- `columns` — con `board_id`
- `cards` — con `column_id` y `board_id`
- `categories` — con `organization_id`

---

## Phase 2 — Deploy en PRONODO

**Estado:** 📋 Planificado
**Estimado:** 1 semana (en paralelo con Phase 1)

### Objetivos
- Dockerizar la aplicación completa
- Hacer el deploy inicial en infraestructura de PRONODO
- Configurar dominio y HTTPS
- Documentar el proceso de deploy para el equipo técnico

### Entregables
- `Dockerfile` para el server Express
- `docker-compose.yml` (server + client + proxy nginx)
- Dominio: `myboard.pronodo.com` (o subdominio acordado)
- HTTPS con certificado SSL
- Variables de entorno de producción documentadas
- `docs/README-deploy.md` para el equipo de PRONODO
- CI/CD básico (GitHub Actions: build + test en push a main)

---

## Phase 3 — Pitch interno a LFi

**Estado:** 📋 Pendiente de Phase 1
**Audiencia:** Héctor Vera, Iván Colodro, Daniel, Marco

### Objetivos
- Presentar MyBoardLFi como solución interna de gestión de proyectos
- Proponer modelo de compensación o adquisición del software
- Establecer términos de uso y propiedad intelectual

### Entregables
- Demo funcional en `myboard.pronodo.com`
- Deck de 5–6 slides: problema → solución → demo → roadmap → propuesta
- Propuesta comercial: reconocimiento de autoría + compensación o revenue sharing

---

## Phase 4 — Protección de IP y escalado

**Estado:** 📋 Ongoing (desde el inicio del proyecto)

### Acciones permanentes
- Código fuente en repositorio privado de Ibai (GitHub personal)
- Deploy vía build compilado — nunca compartir código fuente con LFi/PRONODO
- Copyright en footer de la aplicación: "MyBoardLFi · © 2026 Ibai Fernández"
- Registro de propiedad intelectual si las negociaciones avanzan
- Versionado semántico documentado en `docs/CHANGELOG.md`
