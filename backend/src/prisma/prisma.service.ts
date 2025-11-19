// Cargar variables de entorno antes de importar
import '../config/env.config';

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Debug: mostrar todas las variables de entorno que empiezan con DATABASE
    console.log('🔍 Variables de entorno disponibles:');
    console.log('DATABASE_URL:', process.env.DATABASE_URL || 'NO DEFINIDA');
    console.log('Todas las variables:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
    
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('❌ DATABASE_URL no está disponible');
      console.error('Variables de entorno cargadas:', Object.keys(process.env).length);
      throw new Error(
        'DATABASE_URL no está definida en el archivo .env. ' +
        'Asegúrate de que el archivo .env existe en la carpeta backend/ con: ' +
        'DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/pm_database?schema=public"'
      );
    }
    
    console.log('✅ DATABASE_URL encontrada, creando conexión...');

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

