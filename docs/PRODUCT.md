# PRODUCT.md — MyBoardLFi

**Documento de visión de producto orientado a stakeholders de LFi**

---

## ¿Qué es MyBoardLFi?

MyBoardLFi es una plataforma de gestión de proyectos y tareas diseñada para agencias de marketing, con soporte para múltiples equipos y clientes en un mismo entorno. Permite organizar el trabajo en tableros visuales tipo Kanban: cada proyecto, campaña o área de la agencia tiene su propio tablero, con columnas que reflejan el flujo de trabajo (pendiente, en progreso, en revisión, entregado) y tarjetas detalladas con toda la información necesaria.

Está construida específicamente para el flujo de trabajo de LFi y corre en infraestructura propia (PRONODO), sin depender de servicios de terceros como Trello o Asana.

---

## El problema que resuelve

LFi gestiona simultáneamente múltiples clientes, campañas, proyectos web y operaciones internas. Hoy, esa información está dispersa en:

- Tableros de Trello (con limitaciones en el plan gratuito)
- Conversaciones de WhatsApp y Slack
- Hojas de cálculo de Google Sheets
- Correos electrónicos

Esto genera:
- Pérdida de contexto ("¿en qué estado está el proyecto de Grupo Vértice?")
- Dificultad para hacer seguimiento de plazos y prioridades
- Visibilidad limitada para la dirección
- Imposibilidad de dar acceso controlado a los clientes

**MyBoardLFi centraliza todo esto en una sola plataforma, bajo control total de LFi.**

---

## Usuarios objetivo

| Perfil | Cómo usa MyBoardLFi |
|---|---|
| **Dirección (Héctor, Iván)** | Vista global de proyectos activos, estado por cliente, carga del equipo |
| **Directores de cuentas (Daniel, Marco)** | Gestión de sus clientes y campañas, seguimiento de entregas |
| **Colaboradores internos** | Tareas asignadas, checklists, fechas de entrega |
| **Clientes de LFi** | Vista de solo lectura (o edición limitada) de sus proyectos — sin ver el trabajo de otros clientes |

---

## Propuesta de valor

1. **Personalizable:** tableros, columnas y categorías adaptados al flujo real de LFi, no a un flujo genérico.
2. **Control total:** los datos de los clientes de LFi están en servidores de PRONODO, no en los de Atlassian o Asana.
3. **Sin costes de licencia:** la inversión es el desarrollo inicial; después es operación pura.
4. **Acceso para clientes incluido:** sin pagar por asientos adicionales.
5. **Construido por talento interno:** Ibai Fernández, conoce el contexto de LFi y puede iterar rápido.

---

## Comparativa con alternativas

| Criterio | Trello Free | Trello Business | Asana Starter | **MyBoardLFi** |
|---|---|---|---|---|
| Precio | $0 | $6 USD/user/mes | $13 USD/user/mes | **$0 licencia** |
| Tableros ilimitados | No (10) | Sí | Sí | **Sí** |
| Colaboradores | Ilimitado | Ilimitado | Ilimitado | **Sí** |
| Acceso clientes | No | Extra | Extra | **Incluido** |
| Datos en tu servidor | No | No | No | **Sí (PRONODO)** |
| Personalizable | No | Limitado | No | **Total** |
| Sin dependencia de terceros | No | No | No | **Sí** |

---

## Modelo freemium (para escalar a otras agencias)

Una vez validado en LFi, MyBoardLFi puede ofrecerse a otras agencias de marketing.

| Tier | Precio | Límites |
|---|---|---|
| **Free** | $0 | 3 tableros, 50 tarjetas, sin colaboradores externos |
| **Pro** | A definir | Sin límites, acceso para clientes, soporte prioritario |

El cambio de tier se gestiona manualmente en la base de datos en la fase inicial; cuando haya volumen suficiente, se conecta una pasarela de pago (Stripe).

---

## Estado actual y próximos pasos

- **Phase 0 (esta semana):** Limpieza del código base, dummy data corporativa, documentación.
- **Phase 1 (próximas 1–2 semanas):** Login, roles, multi-tenant, base de datos real.
- **Phase 2 (en paralelo):** Deploy en PRONODO con dominio propio.
- **Phase 3:** Presentación a la dirección de LFi con demo en vivo.
