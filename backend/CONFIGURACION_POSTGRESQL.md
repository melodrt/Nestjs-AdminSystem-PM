# Configuración de PostgreSQL con pgAdmin

## 📋 Pasos para conectar PostgreSQL con pgAdmin

### 1. Instalar PostgreSQL

Si no tienes PostgreSQL instalado:

**Windows:**
- Descarga desde: https://www.postgresql.org/download/windows/
- O usa el instalador de EnterpriseDB
- Durante la instalación, recuerda la contraseña del usuario `postgres`

**Alternativa rápida (Docker):**
```bash
docker run --name postgres-pm -e POSTGRES_PASSWORD=tu_contraseña -e POSTGRES_DB=pm_database -p 5432:5432 -d postgres
```

### 2. Crear la base de datos

**Opción A: Desde pgAdmin**
1. Abre pgAdmin
2. Conéctate al servidor PostgreSQL (localhost:5432)
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `pm_database`
5. Click "Save"

**Opción B: Desde la línea de comandos (psql)**
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE pm_database;

# Salir
\q
```

### 3. Configurar el archivo .env

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
# Database - Ajusta estos valores según tu configuración
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/pm_database?schema=public"

# JWT Secret
JWT_SECRET="your-secret-key-change-in-production"

# Server Port
PORT=3000
```

**Formato de DATABASE_URL:**
```
postgresql://[usuario]:[contraseña]@[host]:[puerto]/[nombre_base_datos]?schema=public
```

**Ejemplo:**
- Usuario: `postgres`
- Contraseña: `mipassword123`
- Host: `localhost`
- Puerto: `5432`
- Base de datos: `pm_database`

```
DATABASE_URL="postgresql://postgres:mipassword123@localhost:5432/pm_database?schema=public"
```

### 4. Ejecutar las migraciones

Una vez configurado el `.env`, ejecuta las migraciones:

```bash
cd backend
npx prisma migrate dev
```

Esto creará todas las tablas en tu base de datos PostgreSQL.

### 5. Generar el cliente de Prisma

```bash
npx prisma generate
```

### 6. Conectar con pgAdmin

1. Abre pgAdmin
2. Si no tienes un servidor configurado:
   - Click derecho en "Servers" → "Create" → "Server"
   - **General Tab:**
     - Name: `PM Local` (o el nombre que prefieras)
   - **Connection Tab:**
     - Host name/address: `localhost`
     - Port: `5432`
     - Maintenance database: `postgres`
     - Username: `postgres`
     - Password: (tu contraseña de PostgreSQL)
   - Click "Save"

3. Una vez conectado, verás tu base de datos `pm_database` en el panel izquierdo
4. Expande `pm_database` → `Schemas` → `public` → `Tables` para ver todas las tablas

### 7. Verificar la conexión

Puedes verificar que todo funciona ejecutando el backend:

```bash
cd backend
npm run start:dev
```

Si todo está bien, verás: `🚀 Backend corriendo en http://localhost:3000`

## 🔍 Verificar datos en pgAdmin

1. En pgAdmin, expande: `Servers` → `PM Local` → `Databases` → `pm_database` → `Schemas` → `public` → `Tables`
2. Click derecho en cualquier tabla (ej: `workspaces`) → "View/Edit Data" → "All Rows"
3. Verás todos los datos almacenados

## ⚠️ Notas importantes

- **Seguridad:** Nunca subas el archivo `.env` a Git (ya está en `.gitignore`)
- **Puerto:** PostgreSQL usa el puerto `5432` por defecto
- **Usuario por defecto:** `postgres` (puedes crear otros usuarios si lo prefieres)
- **Migraciones:** Si cambias el esquema de Prisma, ejecuta `npx prisma migrate dev` para actualizar la base de datos

## 🐛 Solución de problemas

**Error: "password authentication failed"**
- Verifica que la contraseña en `.env` sea correcta

**Error: "database does not exist"**
- Asegúrate de haber creado la base de datos `pm_database`

**Error: "connection refused"**
- Verifica que PostgreSQL esté corriendo
- En Windows: Services → PostgreSQL → Start

**Error: "relation does not exist"**
- Ejecuta las migraciones: `npx prisma migrate dev`

