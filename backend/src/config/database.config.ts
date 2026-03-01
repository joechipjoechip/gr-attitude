import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const dbType = process.env.DB_TYPE || 'sqlite';
  const forceSync = process.env.FORCE_SYNC === 'true';

  if (dbType === 'postgres') {
    // Support Render's DATABASE_URL or individual vars
    if (process.env.DATABASE_URL) {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: isProduction
          ? { rejectUnauthorized: false }
          : false,
        autoLoadEntities: true,
        synchronize: forceSync || !isProduction,
        migrationsRun: !forceSync && isProduction,
        migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
        logging: process.env.DB_LOGGING === 'true',
      };
    }

    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'gr_user',
      password: process.env.DB_PASSWORD || 'gr_password',
      database: process.env.DB_DATABASE || 'gr_attitude',
      autoLoadEntities: true,
      synchronize: forceSync || !isProduction,
      migrationsRun: !forceSync && isProduction,
      migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
      logging: process.env.DB_LOGGING === 'true',
    };
  }

  // Allow FORCE_SYNC=true to create tables in production (emergency only)
  return {
    type: 'better-sqlite3',
    database: join(process.cwd(), 'gr_attitude.sqlite'),
    autoLoadEntities: true,
    synchronize: forceSync || !isProduction, // Dev: auto-sync | Prod: migrations | Emergency: FORCE_SYNC=true
    migrationsRun: !forceSync && isProduction, // Auto-run migrations in production (unless FORCE_SYNC)
    migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
    logging: process.env.DB_LOGGING === 'true', // Enable with DB_LOGGING=true
  };
});
