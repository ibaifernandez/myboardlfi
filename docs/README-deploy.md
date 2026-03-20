# Guía de Deploy — MyBoardLFi

**Para:** Fernando Murillo / Equipo técnico PRONODO
**Autor:** Ibai Fernández
**Versión:** Phase 1 (en desarrollo) — actualizar con cada release

> Este documento describe cómo desplegar MyBoardLFi en infraestructura PRONODO.
> El código fuente no se distribuye. Se entrega un build compilado + `docker-compose.yml`.

---

## Stack técnico

| Capa | Tecnología | Puerto |
|---|---|---|
| Backend | Node.js 20 + Express | 3003 |
| Frontend | React 18 + Vite (build estático) | servido por nginx |
| Base de datos | Supabase (PostgreSQL hosted) | externo — sin puerto local |
| Email | Resend (SMTP) | externo |
| Proxy inverso | nginx (recomendado) | 80 / 443 |

---

## Requisitos del servidor

- Docker 24+ y Docker Compose v2
- nginx (o Caddy) como proxy inverso con SSL
- Dominio apuntando al servidor (ej. `myboard.lfi.la` o acordado con Ibai)
- Puerto 80 y 443 abiertos
- Node.js **no necesario** — todo corre en Docker

---

## Variables de entorno

Crear el archivo `/opt/myboardlfi/.env` en el servidor con las siguientes variables:

```env
# ── Servidor ──────────────────────────────────────────────
PORT=3003

# ── Supabase ──────────────────────────────────────────────
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=<proporcionada por Ibai>
SUPABASE_SERVICE_ROLE_KEY=<proporcionada por Ibai — CONFIDENCIAL>
JWT_SECRET=<string aleatorio seguro — mínimo 32 caracteres>

# ── SMTP (Resend) ──────────────────────────────────────────
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=<API key Resend — proporcionada por Ibai>
SMTP_FROM="MyBoardLFi <myboard@lafabricaimaginaria.com>"
DIGEST_TO=ibai@lfi.la

# ── Digest ────────────────────────────────────────────────
DIGEST_HOUR=6
```

> ⚠️ **Nunca** compartir `SUPABASE_SERVICE_ROLE_KEY` ni `SMTP_PASS` por canales inseguros.
> Solicitar valores a Ibai Fernández por canal cifrado.

---

## Estructura de archivos en servidor

```
/opt/myboardlfi/
├── docker-compose.yml      ← proporcionado por Ibai
├── .env                    ← creado por PRONODO con valores reales
└── uploads/                ← carpeta para adjuntos (persistente)
```

---

## docker-compose.yml (pendiente — Phase 2)

> El archivo `docker-compose.yml` se proporcionará cuando Phase 2 esté completada.
> Incluirá: imagen del servidor Express + build estático del cliente servido por nginx.

Estructura prevista:

```yaml
version: '3.9'
services:
  server:
    image: ghcr.io/ibaifernandez/myboardlfi-server:latest
    env_file: .env
    ports:
      - "3003:3003"
    volumes:
      - ./uploads:/app/server/uploads
    restart: unless-stopped

  client:
    image: ghcr.io/ibaifernandez/myboardlfi-client:latest
    ports:
      - "8080:80"
    restart: unless-stopped
```

---

## Configuración nginx (ejemplo)

```nginx
server {
    listen 80;
    server_name myboard.lfi.la;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myboard.lfi.la;

    ssl_certificate     /etc/letsencrypt/live/myboard.lfi.la/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myboard.lfi.la/privkey.pem;

    # Frontend (client build)
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api {
        proxy_pass http://localhost:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads estáticos
    location /uploads {
        proxy_pass http://localhost:3003;
    }
}
```

---

## Checklist de deploy

- [ ] Servidor con Docker disponible
- [ ] Dominio DNS apuntando a la IP del servidor
- [ ] Certificado SSL emitido (Let's Encrypt / Certbot)
- [ ] Archivo `.env` creado con valores reales
- [ ] Carpeta `uploads/` creada con permisos correctos
- [ ] `docker-compose.yml` recibido de Ibai
- [ ] `docker compose up -d` ejecutado
- [ ] Health check: `curl https://myboard.lfi.la/api/health` → `{"status":"ok"}`
- [ ] Login funcional en el dominio de producción
- [ ] Email de prueba enviado y recibido

---

## Contacto

**Ibai Fernández** — ibai@lfi.la / ibai.fernandez@lafabricaimaginaria.com
Cualquier duda técnica sobre la aplicación, contactar directamente a Ibai.
Las credenciales de Supabase y Resend las proporciona Ibai por canal seguro.
