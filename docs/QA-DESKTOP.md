# QA Desktop — MyBoardLFi

Checklist de calidad para navegador de escritorio. Ejecutar antes de cada demo o release.
Navegadores objetivo: Chrome 120+, Safari 17+, Firefox 121+, Edge 120+.

---

## 1. Autenticación

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| A01 | Login con credenciales correctas (`ibai@lfi.la`) | ⬜ | |
| A02 | Login con email de dominio no permitido (`test@gmail.com`) → mensaje de error inmediato | ⬜ | |
| A03 | Login con contraseña incorrecta → mensaje de error claro | ⬜ | |
| A04 | Botón "Olvidé mi contraseña" → formulario visible en misma pantalla | ⬜ | |
| A05 | Envío de email de recuperación → confirmación visual | ⬜ | |
| A06 | Enlace de recuperación en email → redirige a `/reset-password` | ⬜ | |
| A07 | Formulario de nueva contraseña → validación de mínimo 8 caracteres | ⬜ | |
| A08 | Contraseñas no coinciden → error visible | ⬜ | |
| A09 | Contraseña actualizada → redirige al login | ⬜ | |
| A10 | Logout → vuelve a pantalla de login, token eliminado de localStorage | ⬜ | |
| A11 | Acceso directo a `/` sin token → redirige a login | ⬜ | |
| A12 | Token expirado → comportamiento correcto (cierre de sesión o renovación) | ⬜ | |

---

## 2. Tableros

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| B01 | Carga inicial: sidebar muestra todos los tableros | ⬜ | |
| B02 | Seleccionar tablero → columnas y tarjetas del tablero correcto | ⬜ | |
| B03 | Crear nuevo tablero → aparece en sidebar, navegación automática | ⬜ | |
| B04 | Renombrar tablero (doble clic o botón) → cambio persistido | ⬜ | |
| B05 | Eliminar tablero → confirmación, desaparece de sidebar | ⬜ | |
| B06 | Reordenar tableros por drag & drop en sidebar | ⬜ | |
| B07 | Atajos ⌘1–⌘9 navegan al tablero correspondiente | ⬜ | |

---

## 3. Columnas

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| C01 | Crear columna → aparece al final del tablero | ⬜ | |
| C02 | Renombrar columna | ⬜ | |
| C03 | Eliminar columna (y sus tarjetas) | ⬜ | |
| C04 | Reordenar columnas por drag & drop | ⬜ | |

---

## 4. Tarjetas

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| D01 | Crear tarjeta en columna | ⬜ | |
| D02 | Abrir modal de tarjeta → todos los campos visibles | ⬜ | |
| D03 | Editar título, descripción, prioridad, fecha límite | ⬜ | |
| D04 | Asignar categoría → badge visible en la tarjeta | ⬜ | |
| D05 | Añadir ítem al checklist → marcar como hecho | ⬜ | |
| D06 | Subir adjunto de imagen | ⬜ | |
| D07 | Eliminar tarjeta | ⬜ | |
| D08 | Mover tarjeta entre columnas por drag & drop | ⬜ | |
| D09 | Mover tarjeta a otro tablero por drag & drop (selector de columna) | ⬜ | |
| D10 | Al mover tarjeta a columna "completado/hecho": prioridad pasa a `none` | ⬜ | |

---

## 5. Búsqueda y filtros

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| E01 | Búsqueda global (todos los tableros) → resultados con tablero y columna | ⬜ | |
| E02 | Filtro por categoría → solo tarjetas de esa categoría | ⬜ | |
| E03 | Filtro por prioridad | ⬜ | |
| E04 | Búsqueda en tablero activo | ⬜ | |
| E05 | Limpiar filtros → vuelven todas las tarjetas | ⬜ | |

---

## 6. Email — Digest

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| F01 | Botón "Enviarme mis tareas" → spinner durante envío | ⬜ | |
| F02 | Email recibido con tarjetas agrupadas por tablero | ⬜ | |
| F03 | Prioridades y fechas correctamente mostradas | ⬜ | |
| F04 | Si no hay tareas urgentes → mensaje "sin pendientes" sin enviar email | ⬜ | |

---

## 7. Accesibilidad

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| G01 | Navegación completa por teclado (Tab, Enter, Escape) | ⬜ | |
| G02 | Login accesible sin ratón | ⬜ | |
| G03 | Contraste de texto: ratio mínimo 4.5:1 en texto normal | ⬜ | Fondo oscuro — verificar badges y texto secundario |
| G04 | Formularios con labels asociados correctamente | ⬜ | |
| G05 | Mensajes de error anunciados (no solo por color) | ⬜ | |
| G06 | Imágenes con alt text (`lfi.png` → alt="LFi") | ⬜ | |
| G07 | Focus visible en todos los elementos interactivos | ⬜ | |

---

## 8. Rendimiento

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| H01 | Lighthouse Performance ≥ 80 en localhost | ⬜ | |
| H02 | First Contentful Paint < 1.5s | ⬜ | |
| H03 | Sin errores en consola del navegador en flujo normal | ⬜ | |
| H04 | Network: ninguna petición con credenciales expuestas | ⬜ | Verificar que `service_role` no aparece en requests del cliente |
| H05 | Bundle JS < 500 KB gzipped | ⬜ | `npm run build` en client |

---

## 9. Seguridad

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| I01 | Petición a `/api/boards` sin token → 401 | ⬜ | Pendiente: proteger rutas con `requireAuth` |
| I02 | Token manipulado → 401 | ⬜ | |
| I03 | Email con dominio no corporativo → bloqueado en servidor (no solo en UI) | ⬜ | |
| I04 | `SUPABASE_SERVICE_ROLE_KEY` no aparece en ninguna respuesta del servidor | ⬜ | |
| I05 | Headers HTTP de seguridad presentes (`X-Frame-Options`, `X-Content-Type-Options`, etc.) | ⬜ | Pendiente: instalar `helmet` |
| I06 | CORS: solo acepta `localhost:5175` (dev) — verificar en producción | ⬜ | |

---

## Estado general

| Área | Estado |
|---|---|
| Autenticación | 🔄 Implementado — pendiente QA |
| Tableros / Columnas / Tarjetas | ✅ Funcional (datos desde `tasks.json`) |
| Email digest | ✅ Funcional |
| Accesibilidad | ⚠️ No auditado |
| Rendimiento | ⚠️ No medido |
| Seguridad (headers) | ❌ Pendiente `helmet` |
| Rutas protegidas por auth | ❌ Pendiente migración a Supabase |

---

*Última actualización: 2026-03-19 — Sesión 1 Phase 1*
