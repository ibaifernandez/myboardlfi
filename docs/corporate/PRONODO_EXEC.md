# MyBoard para Pronodo — Propuesta Ejecutiva

**Versión:** 1.0
**Fecha:** 2026-03-03
**Preparado por:** Ibai Fernández

---

## Resumen ejecutivo

Pronodo necesita una herramienta de gestión de tareas y proyectos que se adapte a su forma de trabajar, no al revés. MyBoard es una aplicación Kanban desarrollada internamente que puede desplegarse en la infraestructura propia de Pronodo en menos de una semana, sin coste de licencia y con control total sobre los datos.

**La propuesta en tres puntos:**
1. MyBoard Phase 1 está completo y en uso activo — no es un prototipo.
2. El despliegue empresarial (Phase 2) se puede acometer en 4-6 semanas.
3. El coste total de propiedad a 3 años es sustancialmente inferior a cualquier SaaS equivalente.

---

## El problema

Las herramientas de gestión de proyectos del mercado (Trello, Asana, Jira, Notion) presentan problemas estructurales para una empresa como Pronodo:

| Problema | Impacto |
|---|---|
| Datos en servidores de terceros | Riesgo de privacidad + dependencia de disponibilidad ajena |
| Precios por usuario que escalan | Coste creciente conforme crece el equipo |
| Funcionalidades que no se usan | Curva de aprendizaje innecesaria + ruido en la UI |
| Sin adaptación a procesos propios | El equipo se adapta a la herramienta, no al revés |
| Lock-in | Exportación limitada; migración costosa si el proveedor cambia su política |

---

## La solución

MyBoard es una aplicación web Kanban propia, con las siguientes características clave para Pronodo:

- **Datos en servidores de Pronodo** — nadie más tiene acceso a las tareas del equipo
- **Sin coste por usuario** — el único coste es la infraestructura (servidor que probablemente ya existe)
- **Código propio** — cualquier modificación o integración es posible sin pedir permiso a nadie
- **UI limpia** — solo lo que se necesita, sin funcionalidades que generan ruido
- **Diseño adaptable** — la identidad visual de Pronodo puede aplicarse sin restricciones

---

## Estado del producto

MyBoard Phase 1 está completo y en uso activo desde marzo 2026:

| Funcionalidad | Estado |
|---|---|
| Tablero Kanban con columnas | ✅ Producción |
| Drag & drop entre columnas | ✅ Producción |
| Cards con descripción, prioridad, fecha, tags | ✅ Producción |
| Checklist con progreso visual | ✅ Producción |
| Categorías editables con colores | ✅ Producción |
| Filtros por categoría, prioridad y etiqueta | ✅ Producción |
| Multi-board (múltiples tableros) | ✅ Producción |
| API REST completa | ✅ Producción |

---

## Plan de despliegue para Pronodo (Phase 2)

### Timeline estimado: 4–6 semanas

**Semana 1 — Infraestructura**
- Configuración del servidor (VPS / Railway / servidor interno)
- Base de datos PostgreSQL o SQLite según infraestructura existente
- HTTPS + dominio interno (ej: `board.pronodo.com`)
- Variables de entorno y secretos

**Semana 2 — Autenticación**
- Sistema de login con JWT
- Registro/invitación de usuarios por email
- Roles: Admin, Member, Viewer

**Semana 3 — Multi-usuario**
- Workspaces por equipo/proyecto
- Permisos por tablero
- Historial de actividad por card

**Semana 4 — Adaptación visual**
- Colores e identidad visual de Pronodo
- Logo y favicon
- Dominio definitivo

**Semanas 5–6 — Migración y onboarding**
- Importación de datos existentes
- Formación del equipo (1 sesión de 30 minutos es suficiente)
- Periodo de prueba + ajustes

---

## Inversión requerida

### Desarrollo Phase 2
| Concepto | Estimación |
|---|---|
| Backend: autenticación + multi-usuario | 40–60h |
| Frontend: adapaciones UI multi-usuario | 20–30h |
| Deploy + infraestructura | 10–15h |
| Adaptación visual | 5–10h |
| Testing + onboarding | 10–15h |
| **Total estimado** | **85–130h** |

### Infraestructura (coste mensual recurrente)
| Opción | Coste/mes | Nota |
|---|---|---|
| Railway (starter) | ~$5–10 | Opción más sencilla para empezar |
| Render | ~$7–14 | Alternativa similar |
| VPS propio (Hetzner, etc.) | ~$4–8 | Más control, más gestión |
| Servidor interno Pronodo | $0 (hardware existente) | Si ya existe el servidor |

### Comparativa vs. SaaS (equipo de 10 personas, 3 años)

| Herramienta | Coste/usuario/mes | Coste total (10u × 36m) |
|---|---|---|
| Trello Business | $10 | $3.600 |
| Asana Starter | $13,49 | $4.856 |
| Jira Standard | $8,15 | $2.934 |
| Notion Team | $15 | $5.400 |
| **MyBoard** | **$0** | **Solo infraestructura (~$180–504)** |

---

## Por qué ahora

Phase 1 de MyBoard está completo. El código base existe y funciona. Phase 2 es una extensión del mismo código, no un nuevo proyecto. El momento de menor coste para una adopción empresarial es ahora, antes de que Pronodo escale su equipo y la migración desde herramientas externas sea más costosa.

---

## Próximos pasos propuestos

1. **Kick-off técnico** — reunión de 1h con IT para revisar infraestructura disponible y decidir hosting
2. **Demo en vivo** — 30 minutos de demo del producto actual con el equipo que lo usaría
3. **Decisión de Phase 2** — confirmación de go/no-go y asignación de recursos
4. **Inicio de desarrollo** — arrancamos la semana siguiente al go-ahead

---

## Comunicaciones de kick-off

### Email de anuncio al equipo (plantilla)

```
Asunto: Presentamos MyBoard — nuestra nueva herramienta de gestión de tareas

Hola equipo,

A partir de [fecha], empezamos a usar MyBoard para gestionar nuestros proyectos y tareas del día a día.

MyBoard es una herramienta Kanban desarrollada por nosotros mismos. Eso significa que:
- Nuestros datos se quedan en nuestros servidores
- Podemos adaptarla a como trabajamos nosotros
- No pagamos por licencias que no controlamos

Durante las próximas semanas haremos la migración gradual. Habrá una sesión de introducción el [fecha/hora] de ~30 minutos donde veremos cómo funciona.

Cualquier pregunta, a [contacto].

Saludos,
[Firma]
```

### Email de invitación individual (plantilla)

```
Asunto: Tu acceso a MyBoard

Hola [nombre],

Tu cuenta en MyBoard de Pronodo está lista.

Accede aquí: https://board.pronodo.com
Tu usuario: [email]
Contraseña temporal: [contraseña]  ← te pedirá cambiarla en el primer acceso

Tienes acceso a los tableros: [lista de tableros]

Si tienes algún problema para entrar, escríbeme directamente.

Saludos,
[Firma]
```

### Agenda de la sesión de onboarding (30 min)

```
MyBoard — Sesión de introducción · 30 minutos

0:00 — Qué es MyBoard y por qué lo estamos usando (5 min)
0:05 — Tour de la interfaz: tableros, columnas, cards (5 min)
0:10 — Crear y editar una card (5 min)
0:15 — Drag & drop y cómo mover tareas entre columnas (5 min)
0:20 — Filtros: buscar lo que necesitas en el tablero (5 min)
0:25 — Preguntas y cierre (5 min)
```

---

## Contacto

Para avanzar con esta propuesta:

**Ibai Fernández**
info@ibaifernandez.com
