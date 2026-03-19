# AGENTS.md — Reglas persistentes para el agente de IA

> Este archivo es leído automáticamente por Claude Code al inicio de cada sesión.
> Define cómo debe comportarse el agente durante todo el desarrollo de MyBoardLFi.
> **No modificar sin consenso explícito con el owner del proyecto.**

---

## 1. Identidad del proyecto

- **Nombre:** MyBoardLFi
- **Owner:** Ibai Fernández (info@ibaifernandez.com)
- **Fase actual:** Phase 0 — Limpieza y documentación → Phase 1 — Multi-tenant y autenticación
- **Documentación de referencia:**
  - Arquitectura → `docs/ARCHITECTURE.md`
  - Roadmap → `docs/ROADMAP.md`
  - Decisiones → `docs/DECISIONS.md`
  - Backlog → `docs/BACKLOG.md`
  - Producto → `docs/PRODUCT.md`
- **Datos de demo:** `server/data/tasks.json` contiene dummy data corporativa — puede sobreescribirse libremente en desarrollo. En producción será reemplazado por base de datos real (Supabase/PostgreSQL).

---

## 2. Comportamiento general del agente

- Trabaja paso a paso y confirma al terminar cada Paso antes de continuar al siguiente (salvo instrucción explícita de operar en modo autónomo).
- Antes de escribir código, lee los archivos relevantes. No propongas cambios sobre código que no hayas leído.
- Documenta toda decisión no trivial en `docs/DECISIONS.md`.
- Registra todos los cambios significativos en `docs/CHANGELOG.md`.
- Actualiza `docs/BACKLOG.md` al completar o agregar tareas.

---

## 3. Convenciones de código

- Idioma del código: **inglés** (variables, funciones, comentarios en código).
- Idioma de documentación y commits: **español**.
- Formato de commits: `tipo: descripción breve en español` (ej. `feat: añadir autenticación JWT`).
- No añadir features no solicitadas. No refactorizar más allá de lo pedido.
- No añadir manejo de errores para escenarios imposibles. Validar solo en fronteras del sistema.

---

## 4. Reglas críticas de puertos

- **Server:** 3003 | **Client:** 5175
- MyBoard personal: 3001/5173 | conta-if: 3002/5174
- Nunca matar procesos en estos puertos sin verificar primero a qué proyecto pertenecen.

---

## 5. Reglas de datos

- `server/data/tasks.json` contiene **dummy data corporativa de LFi** — libre de modificar en desarrollo.
- Nunca sobreescribir con datos personales de Ibai.
- En producción (Phase 1+), este archivo es reemplazado por Supabase; no depender de él en lógica de negocio nueva.

---

## 6. Reglas de Phase 1 (multi-tenant)

Antes de implementar cualquier feature de Phase 1:
1. Leer `docs/ARCHITECTURE.md` completo.
2. Verificar que el esquema de base de datos está definido en `docs/ARCHITECTURE.md`.
3. No mezclar lógica de `tasks.json` con lógica de Supabase — crear capas separadas.

---

## 7. Propiedad intelectual

- El código fuente reside en repo privado de Ibai Fernández.
- No compartir acceso al código fuente con LFi ni con PRONODO directamente.
- Los deploys a producción se realizan mediante build compilado, no código fuente.
- Copyright: "MyBoardLFi · © 2026 Ibai Fernández"
