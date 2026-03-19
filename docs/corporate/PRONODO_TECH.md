# MyBoard para Pronodo — Requisitos Técnicos

**Versión:** 1.0
**Fecha:** 2026-03-03
**Destinatario:** Equipo IT / DevOps de Pronodo

---

## Resumen

Este documento describe los requisitos de infraestructura, seguridad y mantenimiento para el despliegue de MyBoard en el entorno de Pronodo.

MyBoard es una aplicación web cliente-servidor (React SPA + Express.js) que puede ejecutarse en cualquier servidor con Node.js. No requiere servicios externos salvo el propio servidor.

---

## 1. Arquitectura del sistema

```
Internet / Red interna
      │
      ▼
┌─────────────────┐
│   Reverse Proxy  │  (Nginx o Caddy)
│   HTTPS :443     │
│   → /api → :3001 │
│   → /*   → :5173 (dev) o static (prod)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Express.js    │  Puerto 3001 (configurable)
│   API REST      │
│   /api/*        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL /   │  Phase 2 (actualmente: tasks.json)
│  SQLite         │
└─────────────────┘
```

En Phase 1 (actual), no hay base de datos externa: los datos viven en `server/data/tasks.json` en el mismo servidor. La migración a PostgreSQL es un cambio de una capa interna (`server/utils/db.js`) sin impacto en el resto del sistema.

---

## 2. Requisitos del servidor

### Mínimos (Phase 1 — uso personal/pequeño equipo)
| Recurso | Mínimo | Recomendado |
|---|---|---|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 512 MB | 1 GB |
| Disco | 2 GB | 10 GB |
| Sistema Operativo | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |
| Node.js | ≥ 18 LTS | 20 LTS |

### Para Phase 2 (multi-usuario con base de datos)
| Recurso | Mínimo | Recomendado |
|---|---|---|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 1 GB | 2–4 GB |
| Disco | 10 GB SSD | 20 GB SSD |
| Base de datos | PostgreSQL 15+ o SQLite | PostgreSQL 15+ |

---

## 3. Software requerido en el servidor

```bash
# Node.js 20 LTS
node --version  # v20.x.x

# npm (viene con Node)
npm --version   # 10.x.x

# git (para deployar desde repositorio)
git --version   # 2.x.x

# Reverse proxy (elegir uno)
nginx --version   # o
caddy version

# Opcional: PM2 para gestión de procesos Node en producción
pm2 --version  # 5.x.x
```

---

## 4. Configuración de red

### Puertos necesarios
| Puerto | Protocolo | Uso | Exposición |
|---|---|---|---|
| 443 | HTTPS | Tráfico web (reverse proxy) | Público |
| 80 | HTTP | Redirección a HTTPS | Público |
| 3001 | HTTP | Express API | Solo interno (localhost) |
| 5432 | TCP | PostgreSQL (Phase 2) | Solo interno |

> El puerto 3001 (Express) **nunca debe estar expuesto directamente** a internet. El proxy inverso (Nginx/Caddy) es la única puerta de entrada.

### DNS
Se necesita un registro DNS apuntando al servidor:
```
board.pronodo.com  →  A  →  [IP del servidor]
```

### Firewall (reglas recomendadas)
```
# Permitir
ufw allow 22/tcp    # SSH (restringido a IPs conocidas si es posible)
ufw allow 80/tcp    # HTTP (solo para redirect a HTTPS)
ufw allow 443/tcp   # HTTPS

# Denegar todo lo demás por defecto
ufw default deny incoming
ufw enable
```

---

## 5. Ejemplo de configuración Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name board.pronodo.com;

    ssl_certificate     /etc/letsencrypt/live/board.pronodo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/board.pronodo.com/privkey.pem;

    # Frontend estático (build de producción)
    root /var/www/myboard/client/dist;
    index index.html;

    # SPA fallback — todas las rutas van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API — proxy al servidor Express
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name board.pronodo.com;
    return 301 https://$host$request_uri;
}
```

---

## 6. Variables de entorno

Crear el archivo `server/.env` en el servidor (no versionar en git):

```bash
# Puerto del servidor Express
PORT=3001

# Entorno
NODE_ENV=production

# JWT (Phase 2)
JWT_SECRET=un_secreto_largo_y_aleatorio_de_al_menos_32_caracteres

# Base de datos (Phase 2, si se usa PostgreSQL)
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/myboard

# CORS — dominio del frontend en producción
ALLOWED_ORIGIN=https://board.pronodo.com
```

---

## 7. Proceso de despliegue

### Primera instalación

```bash
# 1. Clonar el repositorio
git clone [url-del-repo] /var/www/myboard
cd /var/www/myboard

# 2. Instalar dependencias
npm install
cd client && npm install && cd ..

# 3. Build del frontend
cd client && npm run build && cd ..

# 4. Configurar variables de entorno
cp server/.env.example server/.env
nano server/.env  # Editar con los valores reales

# 5. Arrancar el servidor con PM2
pm2 start server/index.js --name myboard-api
pm2 save
pm2 startup  # Para que arranque automáticamente tras reinicios

# 6. Configurar Nginx (ver sección 5)
sudo nano /etc/nginx/sites-available/myboard
sudo ln -s /etc/nginx/sites-available/myboard /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 7. Certificado SSL (Let's Encrypt)
sudo certbot --nginx -d board.pronodo.com
```

### Actualización del código

```bash
cd /var/www/myboard
git pull origin main
npm install
cd client && npm install && npm run build && cd ..
pm2 restart myboard-api
```

---

## 8. Backup de datos

### Backup del JSON (Phase 1)
```bash
# Backup diario automático (añadir a crontab)
0 2 * * * cp /var/www/myboard/server/data/tasks.json \
  /backups/myboard/tasks_$(date +%Y%m%d).json

# Rotación: mantener últimos 30 días
find /backups/myboard/ -name "tasks_*.json" -mtime +30 -delete
```

### Backup de PostgreSQL (Phase 2)
```bash
# Backup diario
0 2 * * * pg_dump myboard > /backups/myboard/db_$(date +%Y%m%d).sql
find /backups/myboard/ -name "db_*.sql" -mtime +30 -delete
```

---

## 9. Seguridad

### Obligatorio antes de producción
- [ ] HTTPS activo con certificado válido (Let's Encrypt es suficiente)
- [ ] Puerto 3001 solo accesible desde localhost (no expuesto al exterior)
- [ ] Variables de entorno con secretos fuera del repositorio git
- [ ] SSH con clave pública (desactivar autenticación por contraseña)
- [ ] Firewall configurado (ver sección 4)
- [ ] `NODE_ENV=production` en variables de entorno (Express activa protecciones adicionales)

### Phase 2 (autenticación)
- [ ] JWT con expiración razonable (recomendado: 24h para access token, 30d para refresh)
- [ ] Contraseñas hasheadas con bcrypt (coste ≥ 12)
- [ ] Rate limiting en endpoints de autenticación (`express-rate-limit`)
- [ ] CORS restringido al dominio del frontend
- [ ] Cabeceras de seguridad HTTP (`helmet` middleware)

### Buenas prácticas
- Actualizar Node.js al LTS activo cada 6 meses
- Revisar `npm audit` antes de cada deploy
- No exponer el endpoint `/api/` sin autenticación en Phase 2

---

## 10. Monitorización (recomendado)

Para un primer despliegue básico es suficiente con:

```bash
# Ver estado del proceso
pm2 status

# Ver logs en tiempo real
pm2 logs myboard-api

# Ver métricas de CPU/RAM
pm2 monit
```

Para monitorización más avanzada (Phase 2+): UptimeRobot (free tier), Sentry para errores del servidor, o cualquier stack de observabilidad del ecosistema de Pronodo.

---

## 11. Dependencias del sistema

### Node.js packages (servidor)
```json
{
  "express": "^4",
  "cors": "latest",
  "uuid": "^9"
}
```

### Node.js packages (cliente, solo para build)
```json
{
  "react": "^18",
  "react-dom": "^18",
  "vite": "^5",
  "@dnd-kit/core": "latest",
  "@dnd-kit/sortable": "latest",
  "tailwindcss": "^3",
  "lucide-react": "latest"
}
```

No hay dependencias de servicios externos (AWS, Firebase, Stripe, etc.). La app puede funcionar completamente offline en una red interna.

---

## 12. Contacto técnico

Para preguntas sobre la arquitectura, el código o el proceso de despliegue:

**Ibai Fernández**
info@ibaifernandez.com
