# COMMANDS — MyBoard

Referencia rápida de comandos útiles para el desarrollo de MyBoard.

---

## Arrancar la app

```bash
# Desde la raíz del proyecto
npm run dev
# → Express en http://localhost:3001
# → Vite en http://localhost:5173
```

---

## Scripts individuales

```bash
# Solo el servidor Express
npm run server

# Solo el cliente Vite
npm run client

# Build de producción del cliente
npm run build
```

---

## Instalación inicial

```bash
# Desde la raíz del proyecto
npm install              # Dependencias del servidor
cd client && npm install # Dependencias del cliente
cd ..
```

---

## Verificar que el servidor responde

```bash
# Listar todos los tableros
curl http://localhost:3001/api/boards

# Listar todas las categorías
curl http://localhost:3001/api/categories

# Listar cards de un tablero (sustituye {boardId} por el ID real)
curl http://localhost:3001/api/boards/{boardId}/cards
```

---

## Inspeccionar los datos

```bash
# Ver el JSON de datos completo (formateado)
cat "server/data/tasks.json" | python3 -m json.tool

# Contar boards
cat "server/data/tasks.json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d['boards']), 'boards')"

# Contar cards
cat "server/data/tasks.json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d['cards']), 'cards')"

# Contar categorías
cat "server/data/tasks.json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('categories',[])), 'categorías')"
```

---

## Digest de tareas (correo diario)

```bash
# Enviar el digest ahora mismo (sin esperar al cron)
node -e "require('dotenv').config(); require('./server/digest').sendDigest()"
```

Requiere que `.env` tenga configuradas las variables `SMTP_*` y `DIGEST_TO`.
Consulta `.env.example` para ver todas las variables disponibles.

---

## Git

```bash
# Ver estado
git status

# Añadir cambios y commitear (sustituye el mensaje)
git add client/src/components/Card/Card.jsx
git commit -m "Añade icono de prioridad en card"

# Ver historial compacto
git log --oneline -10
```

---

## Puertos y proxy

| Servicio | Puerto | URL |
|---|---|---|
| Express API | 3001 | http://localhost:3001 |
| Vite dev server | 5173 | http://localhost:5173 |

Vite proxy: todas las peticiones a `/api/*` se redirigen automáticamente a `localhost:3001`.

---

## Limpieza

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules client/node_modules
npm install && cd client && npm install && cd ..

# Limpiar build del cliente
rm -rf client/dist
```

---

## ⚠️ Lo que NO hacer

```bash
# NUNCA sobreescribas los datos reales
# ❌ echo '{}' > server/data/tasks.json
# ❌ rm server/data/tasks.json

# NUNCA instales dependencias sin revisar AGENTS.md primero
# ❌ npm install alguna-libreria-nueva
```
