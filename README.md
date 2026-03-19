# MyBoardLFi

**Plataforma de gestión de proyectos y tareas para equipos de agencia**

> MyBoardLFi · © 2026 Ibai Fernández

---

## ¿Qué es MyBoardLFi?

MyBoardLFi es una herramienta de gestión de proyectos tipo Kanban, diseñada específicamente para el flujo de trabajo de LFi. Permite organizar campañas, clientes, proyectos web, automatizaciones y operaciones internas en tableros visuales, con tarjetas detalladas que incluyen prioridades, fechas de entrega, checklists y categorías.

Está construida sobre tecnología web moderna (React + Node.js), corre en la infraestructura de PRONODO, y no depende de ningún SaaS externo: es software propio, con control total de datos.

---

## ¿Por qué MyBoardLFi y no Trello o Asana?

| Característica | Trello | Asana | **MyBoardLFi** |
|---|---|---|---|
| Costo mensual | $6–17 USD/usuario | $13–25 USD/usuario | **$0** (infraestructura propia) |
| Control de datos | En servidores de Atlassian | En servidores de Asana | **En PRONODO (tu infraestructura)** |
| Personalización | Limitada | Limitada | **Total** |
| Acceso para clientes | Con costo adicional | Con costo adicional | **Incluido (tier guest)** |
| Privacidad de datos de clientes | Sujeta a ToS de terceros | Sujeta a ToS de terceros | **100% bajo control de LFi** |
| Adaptado al flujo de LFi | No | No | **Sí, construido para LFi** |

---

## ¿Qué se puede hacer?

- Crear tableros por cliente, campaña o área (Proyectos Activos, Campañas Email, Clientes, etc.)
- Gestionar tarjetas con prioridad (alta/media/baja), fecha de entrega, descripción y checklists
- Categorizar por tipo de trabajo: web, email-marketing, social-media, automatización, etc.
- Filtrar y buscar tareas por categoría, prioridad o palabra clave
- Subir adjuntos a las tarjetas (imágenes, documentos)
- **Próximamente (Phase 1):** sistema de usuarios con roles, acceso por cliente, vista multi-equipo

---

## Roadmap de desarrollo

### Phase 0 — Limpieza y preparación *(semana del 18/03/2026)* — 🔄 En curso
Eliminar datos personales, cargar dummy data corporativa, actualizar documentación, ajustar puertos.

### Phase 1 — Multi-tenant y autenticación *(1–2 semanas)* — 📋 Planificado
Sistema de login con JWT + roles (superadmin / admin / colaborador / cliente / guest). Multi-tenancy con `organizationId`. Migración de `tasks.json` a Supabase (PostgreSQL). Límites freemium por tenant.

### Phase 2 — Deploy en PRONODO *(1 semana, en paralelo con Phase 1)* — 📋 Planificado
Dockerización, dominio `myboard.pronodo.com`, HTTPS, variables de entorno de producción, `README-deploy.md` para el equipo técnico.

### Phase 3 — Pitch interno a LFi *(tras Phase 1)* — 📋 Pendiente
Presentación a Daniel y Marco: problema → solución → demo → roadmap → propuesta de compensación o adquisición.

### Phase 4 — Protección de IP y escalado *(ongoing)*
Código fuente en repo privado. Deploy de build compilado. Registro de propiedad intelectual si procede.

---

## Para el equipo técnico (Fernando Murillo / PRONODO)

### Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Base de datos (actual) | JSON plano (`server/data/tasks.json`) |
| Base de datos (Phase 1) | Supabase (PostgreSQL hosted) |
| Autenticación (Phase 1) | Supabase Auth + JWT |
| Deploy | Docker + PRONODO |

### Cómo arrancar en local

```bash
# 1. Clonar el repositorio (privado)
git clone <repo-privado> MyBoardLFi
cd MyBoardLFi

# 2. Instalar dependencias
npm install
cd client && npm install && cd ..

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales SMTP reales

# 4. Arrancar en modo desarrollo
npm run dev
# Server: http://localhost:3003
# Client: http://localhost:5175
```

### Puertos

- **Server (Express):** 3003
- **Client (Vite):** 5175

### Scripts disponibles

```bash
npm run dev       # Arranca server + client en paralelo (concurrently)
npm run server    # Solo el servidor Express
npm run client    # Solo el cliente Vite
```

---

*MyBoardLFi · © 2026 Ibai Fernández · Todos los derechos reservados*
