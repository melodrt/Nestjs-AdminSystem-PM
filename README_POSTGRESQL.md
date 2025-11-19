# 🐘 Guía Rápida: Conectar PostgreSQL con pgAdmin

## Pasos Rápidos

### 1. Instalar PostgreSQL
- Descarga desde: https://www.postgresql.org/download/
- O usa Docker: `docker run --name postgres-pm -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=pm_database -p 5432:5432 -d postgres`

### 2. Crear Base de Datos
En pgAdmin o psql:
```sql
CREATE DATABASE pm_database;
```

### 3. Crear archivo `.env` en `backend/`
```env
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/pm_database?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 4. Ejecutar Migraciones
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 5. Conectar en pgAdmin
- Host: `localhost`
- Port: `5432`
- Database: `pm_database`
- Username: `postgres`
- Password: (tu contraseña)

¡Listo! Ya puedes ver tus tablas en pgAdmin.

Para más detalles, ver: `backend/CONFIGURACION_POSTGRESQL.md`

