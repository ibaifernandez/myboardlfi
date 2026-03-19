# ARCHITECTURE.md — Arquitectura técnica de MyBoardLFi

**Última actualización:** 2026-03-18

---

## Arquitectura Phase 0 (actual)

MyBoardLFi es una SPA (Single-Page Application) con arquitectura cliente-servidor desacoplada. En Phase 0 el servidor persiste datos en un archivo JSON local (dummy data de demostración). En Phase 1 este archivo es reemplazado por Supabase (PostgreSQL hosted).

```
┌─────────────────────────────────────────────────────────┐
│                     NAVEGADOR                           │
│                                                         │
│   React SPA (Vite · puerto 5175)                        │
│   ├── Componentes UI                                    │
│   ├── React Contexts (CategoriesContext)                │
│   ├── Hooks de estado                                   │
│   └── Capa API (fetch → /api/*)                         │
│                          │                              │
│                    proxy /api                           │
└──────────────────────────┼──────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼──────────────────────────────┐
│              SERVIDOR (Express · puerto 3003)           │
│                                                         │
│   Rutas REST                                            │
│   ├── /api/boards                                       │
│   ├── /api/columns                                      │
│   ├── /api/cards                                        │
│   └── /api/categories                                   │
│                          │                              │
│              utils/db.js (readData / writeData)         │
│                          │                              │
│              server/data/tasks.json  ← DEMO DATA        │
└─────────────────────────────────────────────────────────┘
```

---

## Arquitectura objetivo (Phase 1)

En Phase 1, `tasks.json` es reemplazado por Supabase. Se añade capa de autenticación y multi-tenancy.

```
┌─────────────────────────────────────────────────────────┐
│                     NAVEGADOR                           │
│                                                         │
│   React SPA (Vite · puerto 5175)                        │
│   ├── Componentes UI                                    │
│   ├── AuthContext (Supabase Auth SDK)                   │
│   ├── CategoriesContext, BoardsContext                  │
│   ├── Hooks de estado                                   │
│   └── Capa API (fetch → /api/* con JWT en header)       │
│                          │                              │
│                    proxy /api                           │
└──────────────────────────┼──────────────────────────────┘
                           │ HTTP / JSON + Authorization: Bearer <JWT>
┌──────────────────────────▼──────────────────────────────┐
│              SERVIDOR (Express · puerto 3003)           │
│                                                         │
│   Middleware                                            │
│   ├── requireAuth (verifica JWT de Supabase)            │
│   └── requireRole (superadmin/admin/colaborador/...)    │
│                                                         │
│   Rutas REST (todas protegidas por organizationId)      │
│   ├── /api/auth/login, /api/auth/register               │
│   ├── /api/organizations                                │
│   ├── /api/boards       (filtrado por org)              │
│   ├── /api/columns                                      │
│   ├── /api/cards                                        │
│   └── /api/categories   (filtrado por org)              │
│                          │                              │
│              utils/supabase.js (cliente Supabase)       │
└──────────────────────────┼──────────────────────────────┘
                           │ API REST / PostgreSQL
┌──────────────────────────▼──────────────────────────────┐
│                    SUPABASE                             │
│                                                         │
│   Auth (JWT, gestión de usuarios)                       │
│   PostgreSQL                                            │
│   ├── organizations                                     │
│   ├── users (vinculados a Supabase Auth)                │
│   ├── memberships (user ↔ org + rol)                    │
│   ├── boards                                            │
│   ├── columns                                           │
│   ├── cards                                             │
│   └── categories                                        │
└─────────────────────────────────────────────────────────┘
```

---

## Roles y permisos (Phase 1)

| Rol | Descripción | Permisos |
|---|---|---|
| `superadmin` | Ibai Fernández | Todo, incluyendo gestión de organizaciones |
| `admin` | Gerencia de LFi (Héctor, Iván) | Gestión de usuarios y tableros de su org |
| `colaborador` | Equipo de LFi (Daniel, Marco, etc.) | Crear y editar tarjetas en tableros asignados |
| `cliente` | Clientes de LFi | Solo lectura de sus tableros; sin ver otros clientes |
| `guest` | Acceso temporal | Solo lectura de tableros específicamente compartidos |

---

## Multi-tenancy (Phase 1)

Cada organización (tenant) tiene datos completamente aislados mediante `organization_id` en todas las tablas. El flujo es:

1. Usuario se autentica → Supabase devuelve JWT con `user_id`
2. El middleware de Express verifica el JWT y obtiene el `organization_id` del usuario desde la tabla `memberships`
3. Todas las queries de boards, columns, cards y categories filtran por `organization_id`
4. Un usuario nunca puede acceder a datos de otra organización, incluso manipulando la URL

---

## Esquema de base de datos (Phase 1)

```sql
-- Organizaciones (tenants)
organizations (
  id          uuid PRIMARY KEY,
  name        text NOT NULL,
  plan        text DEFAULT 'free',  -- 'free' | 'pro'
  created_at  timestamptz DEFAULT now()
)

-- Usuarios (vinculados a Supabase Auth)
users (
  id          uuid PRIMARY KEY REFERENCES auth.users,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
)

-- Membresías (relación usuario ↔ organización)
memberships (
  id              uuid PRIMARY KEY,
  user_id         uuid REFERENCES users(id),
  organization_id uuid REFERENCES organizations(id),
  role            text NOT NULL,  -- 'superadmin' | 'admin' | 'colaborador' | 'cliente' | 'guest'
  created_at      timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
)

-- Tableros
boards (
  id              uuid PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id),
  title           text NOT NULL,
  created_at      timestamptz DEFAULT now()
)

-- Columnas
columns (
  id        uuid PRIMARY KEY,
  board_id  uuid REFERENCES boards(id) ON DELETE CASCADE,
  title     text NOT NULL,
  "order"   integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
)

-- Tarjetas
cards (
  id           uuid PRIMARY KEY,
  column_id    uuid REFERENCES columns(id) ON DELETE CASCADE,
  board_id     uuid REFERENCES boards(id),  -- desnormalizado para queries rápidas
  title        text NOT NULL,
  description  text,
  priority     text DEFAULT 'none',
  category     text,
  due_date     timestamptz,
  checklist    jsonb DEFAULT '[]',
  "order"      integer DEFAULT 0,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
)

-- Categorías (por organización)
categories (
  id              uuid PRIMARY KEY,
  organization_id uuid REFERENCES organizations(id),
  name            text NOT NULL,
  color           text,
  created_at      timestamptz DEFAULT now()
)
```

---

## Estructura de carpetas

```
MyBoardLFi/
├── client/                         # Frontend React + Vite (puerto 5175)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js           # Wrapper fetch — añadir JWT header en Phase 1
│   │   ├── components/
│   │   │   ├── Board/
│   │   │   ├── Column/
│   │   │   ├── Card/
│   │   │   ├── CardModal/
│   │   │   ├── Sidebar/
│   │   │   ├── Toolbar/
│   │   │   └── UI/
│   │   ├── context/
│   │   │   ├── CategoriesContext.jsx
│   │   │   └── AuthContext.jsx     # Phase 1: contexto de autenticación
│   │   ├── hooks/
│   │   └── utils/
│   └── vite.config.js              # Proxy /api → localhost:3003
│
├── server/                         # Backend Express (puerto 3003)
│   ├── routes/
│   │   ├── boards.js
│   │   ├── columns.js
│   │   ├── cards.js
│   │   ├── categories.js
│   │   ├── uploads.js
│   │   └── auth.js                 # Phase 1: login/register
│   ├── middleware/
│   │   ├── requireAuth.js          # Phase 1: verifica JWT Supabase
│   │   └── requireRole.js          # Phase 1: verifica rol
│   ├── utils/
│   │   ├── db.js                   # Phase 0: readData/writeData JSON
│   │   └── supabase.js             # Phase 1: cliente Supabase
│   ├── data/
│   │   └── tasks.json              # DEMO DATA — no usar en producción
│   └── index.js                    # Middleware + rutas + PORT=3003
│
├── docs/
├── .claude/launch.json             # Puertos 3003/5175
├── CLAUDE.md
├── AGENTS.md
└── README.md
```

---

## Flujo de datos (Phase 0 — actual)

### Lectura
```
Componente React → hook → api/client.js (fetch GET) → Express → db.readData() → tasks.json
```

### Escritura
```
Acción usuario → hook → api/client.js (fetch POST/PUT/DELETE) → Express → readData + mutación + writeData → tasks.json
```

---

## Decisiones de arquitectura

Ver `docs/DECISIONS.md` para el registro completo (ADR-001 a ADR-006).

| Decisión | Motivo clave |
|---|---|
| Supabase como DB en Phase 1 | Auth integrado, PostgreSQL estándar, gratuito en dev |
| Supabase Auth + JWT | Sin implementar auth desde cero |
| Deploy en PRONODO | Control total de datos, sin costes SaaS externos |
| Freemium por campo `plan` | Simplicidad, sin pasarela de pago en fase inicial |
| Fork de MyBoard | MVP completo reutilizable, sin reescribir desde cero |
| Código en repo privado de Ibai | Protección de propiedad intelectual |
