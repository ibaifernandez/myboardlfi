# QA Mobile — MyBoardLFi

Checklist de calidad para dispositivos móviles y tablets.
Dispositivos objetivo: iPhone 14+ (Safari iOS), Samsung Galaxy S23 (Chrome Android), iPad Pro 12.9".

> ⚠️ **Estado actual:** MyBoardLFi Phase 1 **no está optimizado para móvil**. La interfaz fue diseñada para escritorio. Este documento registra el estado real y las mejoras pendientes para Phase 2.

---

## Estado de responsividad por componente

| Componente | Estado | Problema conocido |
|---|---|---|
| Pantalla de login | ✅ Responsive | Funciona bien en móvil (max-w-sm centrado) |
| Sidebar | ❌ No responsive | Ocupa 240px fijos — en móvil desplaza el contenido |
| Toolbar | ⚠️ Parcial | Los filtros se acumulan y desbordan en pantallas < 768px |
| Board (columnas) | ⚠️ Parcial | Scroll horizontal funciona pero la experiencia es limitada |
| Card Modal | ✅ Aceptable | El modal es scrollable, funciona en móvil |
| Reset password | ✅ Responsive | Misma estructura que login |

---

## Checklist funcional (estado actual)

### Autenticación
| # | Prueba | Estado | Notas |
|---|--------|--------|-------|
| M01 | Login en iPhone — formulario visible y usable | ⬜ | |
| M02 | Teclado no tapa el botón de submit | ⬜ | Problema frecuente en iOS |
| M03 | "Olvidé mi contraseña" accesible en móvil | ⬜ | |
| M04 | Email de recuperación: enlace abre en app/browser correcto | ⬜ | |

### Navegación
| # | Prueba | Estado | Notas |
|---|--------|--------|-------|
| M05 | Sidebar visible / accesible en < 768px | ❌ | No implementado — sidebar siempre visible, empuja contenido |
| M06 | Botón hamburguesa para mostrar/ocultar sidebar | ❌ | No existe — pendiente Phase 2 |
| M07 | Navegación entre tableros en móvil | ⚠️ | Posible pero incómodo |

### Tableros y tarjetas
| # | Prueba | Estado | Notas |
|---|--------|--------|-------|
| M08 | Scroll horizontal entre columnas (touch) | ⬜ | |
| M09 | Abrir modal de tarjeta en móvil | ⬜ | |
| M10 | Drag & drop en touch (tarjetas y columnas) | ⚠️ | dnd-kit soporta touch pero no optimizado |
| M11 | Crear tarjeta desde móvil | ⬜ | |
| M12 | Editar checklist en modal desde móvil | ⬜ | |

### Toolbar
| # | Prueba | Estado | Notas |
|---|--------|--------|-------|
| M13 | Barra de herramientas visible sin desbordamiento en 375px | ❌ | Desborda — demasiados elementos |
| M14 | Filtros accesibles en móvil | ❌ | No responsive |
| M15 | Búsqueda global usable en móvil | ⬜ | |

---

## Mejoras pendientes para Phase 2

### Alta prioridad
- [ ] **Sidebar como drawer**: oculta por defecto en móvil, se abre con botón hamburguesa
- [ ] **Toolbar responsive**: colapsar filtros en un menú desplegable en pantallas < 768px
- [ ] **Breakpoints**: revisar todos los componentes con Tailwind `sm:` / `md:` prefixes

### Media prioridad
- [ ] Optimizar drag & drop para touch (activationConstraint ajustado para dedos)
- [ ] Card modal: padding y tipografía ajustados para pantallas pequeñas
- [ ] Botón de logout visible en móvil sin necesidad de scroll

### Baja prioridad
- [ ] PWA (Progressive Web App): manifest.json, service worker básico
- [ ] Icono de app en iOS/Android home screen

---

## Dispositivos de referencia para testing

| Dispositivo | Viewport | Prioridad |
|---|---|---|
| iPhone SE (3ª gen) | 375 × 667 | Alta — pantalla más pequeña común |
| iPhone 14 Pro | 393 × 852 | Alta |
| Samsung Galaxy S23 | 360 × 800 | Media |
| iPad (9ª gen) | 768 × 1024 | Media — sidebar debería ser visible |
| iPad Pro 12.9" | 1024 × 1366 | Baja — similar a desktop |

---

## Herramientas de testing recomendadas

- **Chrome DevTools** → Device Toolbar (F12 → toggle device)
- **Safari** → Develop → Responsive Design Mode
- **BrowserStack** (si se requiere testing real en dispositivos)

---

*Última actualización: 2026-03-19 — Sesión 1 Phase 1*
*Revisión completa pendiente: Phase 2 (optimización mobile)*
