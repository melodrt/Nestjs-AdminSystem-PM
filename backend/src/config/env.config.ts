import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Cargar variables de entorno ANTES de que se importen los módulos
// En desarrollo: __dirname = src/config, necesitamos ir a backend/.env
// En producción: __dirname = dist/config, necesitamos ir a backend/.env
const envPath = resolve(process.cwd(), '.env');

if (!existsSync(envPath)) {
  console.error(`❌ ERROR: No se encontró el archivo .env en: ${envPath}`);
  console.error(`Directorio actual: ${process.cwd()}`);
  console.error('Por favor, crea el archivo .env en la carpeta backend/');
} else {
  console.log(`✅ Cargando .env desde: ${envPath}`);
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    console.error('❌ Error al cargar .env:', result.error);
  } else {
    console.log('✅ Variables de entorno cargadas');
    if (process.env.DATABASE_URL) {
      // Ocultar la contraseña en el log
      const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
      console.log(`DATABASE_URL: ✅ Definida (${maskedUrl})`);
    } else {
      console.log('DATABASE_URL: ❌ No definida');
    }
  }
}

