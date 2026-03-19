# DECISIONS.md — Registro de Decisiones Arquitectónicas

Formato ADR (Architecture Decision Records). Cada entrada documenta una decisión no trivial: contexto, opciones consideradas, decisión tomada y consecuencias.

---

## ADR-001 — Base de datos: Supabase (PostgreSQL hosted)

**Fecha:** 2026-03-18
**Estado:** Aceptada

**Contexto:** La versión personal de MyBoard usa un archivo `tasks.json` como base de datos. Para la versión corporativa multi-tenant necesitamos un sistema de base de datos real con autenticación integrada.

**Opciones consideradas:**
- Supabase (PostgreSQL hosted + Auth integrado + API REST)
- PlanetScale (MySQL serverless)
- MongoDB Atlas
- PostgreSQL autohosteado en PRONODO

**Decisión:** Supabase.

**Razones:**
- Incluye sistema de autenticación integrado (Supabase Auth) — evita implementar auth desde cero
- API REST autogenerada — reduce código de backend
- Plan gratuito generoso para desarrollo y pruebas
- PostgreSQL estándar — sin vendor lock-in real; se puede migrar a PostgreSQL propio en PRONODO en el futuro
- SDK oficial para Node.js y React

**Consecuencias:** Dependencia de la nube de Supabase en Phase 1. En Phase 4 se puede migrar a PostgreSQL self-hosted si LFi lo requiere.

---

## ADR-002 — Autenticación: Supabase Auth con JWT

**Fecha:** 2026-03-18
**Estado:** Aceptada

**Contexto:** Phase 1 requiere autenticación de usuarios con soporte para múltiples roles (superadmin, admin, colaborador, cliente, guest).

**Opciones consideradas:**
- Implementación propia de auth con bcrypt + JWT manual
- Supabase Auth
- Auth0
- Clerk

**Decisión:** Supabase Auth.

**Razones:**
- Viene integrado con la base de datos elegida (ADR-001)
- Manejo seguro de passwords, sesiones y tokens sin implementación propia
- Soporte para OAuth (Google, etc.) si se necesita en el futuro
- Gratuito en el plan inicial

**Consecuencias:** Los tokens JWT de Supabase deben validarse en el middleware de Express. Requiere gestión de `SUPABASE_URL` y `SUPABASE_ANON_KEY` en variables de entorno.

---

## ADR-003 — Deploy: PRONODO

**Fecha:** 2026-03-18
**Estado:** Aceptada

**Contexto:** La aplicación necesita un servidor de producción accesible para el equipo de LFi.

**Opciones consideradas:**
- Vercel + Railway (frontend + backend por separado, SaaS)
- Render
- PRONODO (infraestructura propia de empresa hermana de LFi, gestionada por Fernando Murillo)

**Decisión:** PRONODO.

**Razones:**
- Control total de datos en infraestructura cercana a LFi
- Sin costes de SaaS externos
- Fernando Murillo (PRONODO) ya tiene relación de confianza con LFi
- Permite negociar como parte del pitch a LFi (infraestructura incluida)

**Consecuencias:** Necesario coordinar con Fernando Murillo para dominio, Docker y configuración de servidor. Documentar proceso en `docs/README-deploy.md`.

---

## ADR-004 — Estrategia freemium: control por campo `plan` en el tenant

**Fecha:** 2026-03-18
**Estado:** Aceptada

**Contexto:** Se quiere diferenciar entre un tier Free y un tier Pro para poder controlar el acceso y, eventualmente, monetizar.

**Opciones consideradas:**
- Stripe + lógica de suscripción completa
- Control manual por campo en base de datos
- Sin límites (todo gratuito por ahora)

**Decisión:** Campo `plan` (enum: `free` | `pro`) en la tabla `organizations`. Lógica de límites en middleware del server.

**Razones:**
- Simplicidad en fase inicial — sin pasarela de pago
- Fácil de cambiar manualmente para promover clientes a Pro
- Permite demostrar el modelo de negocio sin infraestructura de pago

**Consecuencias:** Los límites (3 tableros, 50 tarjetas en Free) se validan en el server. Cuando se decida monetizar, se conecta Stripe y se automatiza la actualización del campo `plan`.

---

## ADR-005 — Protección de IP: código fuente en repo privado de Ibai

**Fecha:** 2026-03-18
**Estado:** Aceptada

**Contexto:** MyBoardLFi es creado por Ibai Fernández para uso de LFi. Es fundamental preservar la propiedad intelectual antes de negociar con LFi la compensación o adquisición.

**Decisión:** El código fuente reside exclusivamente en el repositorio privado de GitHub de Ibai. Los deploys a PRONODO se realizan mediante build compilado (artefactos), nunca compartiendo el código fuente.

**Razones:**
- Preservar la propiedad intelectual como palanca de negociación
- Evitar que LFi pueda prescindir del autor una vez tenga el código
- Estándar habitual en proyectos de software para clientes (entrega del producto, no del fuente)

**Consecuencias:** Fernando Murillo (PRONODO) recibe un `docker-compose.yml` con imágenes precompiladas + variables de entorno. No accede al código fuente. Si la negociación incluye adquisición del software, el código fuente se entrega en ese momento.

---

## ADR-007 — Email transaccional: Migadu (provisional) → Resend (producción)

**Fecha:** 2026-03-19
**Estado:** Provisional — pendiente migración

**Contexto:** MyBoardLFi necesita enviar emails transaccionales: digest de tareas bajo demanda y restablecimiento de contraseña vía Supabase Auth.

**Opciones consideradas:**
- Migadu (SMTP personal de Ibai, `info@ibaifernandez.com`)
- Resend con cuenta personal de Ibai (`ibaifernandez.com`) — descartado por mezclar marca personal y corporativa
- Resend con cuenta LFi (`ibai.fernandez@lafabricaimaginaria.com`, dominio `lafabricaimaginaria.com`)
- Supabase built-in email — descartado por rate limits y falta de personalización

**Decisión provisional:** Migadu para pruebas y demo inicial. Resend con cuenta LFi para producción.

**Razones:**
- Migadu ya funciona y permite validar el flujo completo hoy sin bloqueos
- Resend es la solución correcta para producción: reputación de entrega, SDK moderno, logs, webhooks
- La cuenta Resend LFi (`ibai.fernandez@lafabricaimaginaria.com`) ya está creada; solo falta verificar el dominio `lafabricaimaginaria.com` con Fernando Murillo (PRONODO)

**Consecuencias:** ⚠️ Antes de salir a producción, Fernando Murillo debe añadir los registros DNS de Resend para `lafabricaimaginaria.com`. Tras verificación, actualizar `.env`:
```
SMTP_HOST=smtp.resend.com
SMTP_USER=resend
SMTP_PASS=re_CsHnbxZf_4jQSZ9X41BTCrryfXGVs9VGW
SMTP_FROM="MyBoardLFi <myboard@lafabricaimaginaria.com>"
DIGEST_TO=ibai@lfi.la
```
Y en Supabase → Authentication → Email → SMTP Settings: mismas credenciales.

---

## ADR-008 — Restricción de acceso por dominio corporativo

**Fecha:** 2026-03-19
**Estado:** Aceptada

**Contexto:** MyBoardLFi es una herramienta interna corporativa. No debe ser accesible para cualquier dirección de email.

**Decisión:** Login y registro restringidos a dominios `@lfi.la` y `@lafabricaimaginaria.com`. Validación en dos capas: frontend (UX inmediato, sin petición al servidor) y servidor (fuente de verdad en `ALLOWED_DOMAINS`).

**Razones:**
- Evita accesos no autorizados sin necesidad de un sistema de invitaciones complejo en Phase 1
- La validación doble mejora UX (respuesta instantánea) sin sacrificar seguridad (el servidor siempre valida)
- Los dominios son configurables en `server/routes/auth.js` sin tocar la base de datos

**Consecuencias:** Si LFi incorpora colaboradores externos con otros dominios, se añade el dominio a `ALLOWED_DOMAINS` o se implementa un sistema de invitación por token (Phase 2+).

---

## ADR-006 — Fork de MyBoard como base de MyBoardLFi

**Fecha:** 2026-03-18
**Estado:** Aceptada

**Contexto:** Ibai tiene una aplicación Kanban personal funcional (MyBoard, Phase 1 completa). MyBoardLFi necesita las mismas funcionalidades base más capacidades corporativas.

**Decisión:** MyBoardLFi es un fork directo de MyBoard. Se mantienen separados como proyectos independientes.

**Razones:**
- MyBoard ya tiene MVP completo y estable (tableros, columnas, tarjetas, categorías, uploads, búsqueda)
- Evita reescribir funcionalidad probada desde cero
- Los proyectos tienen objetivos distintos: MyBoard es personal, MyBoardLFi es corporativo

**Consecuencias:** Cambios en MyBoard no se propagan automáticamente a MyBoardLFi. Las mejoras corporativas de MyBoardLFi son exclusivas de este fork.
