import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ENTITIES } from '../../../../libs/entities/src';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get('DATABASE_URL');
  if (!url) {
    throw new Error('Database URL is empty');
  }

  return {
    url,
    type: 'postgres',
    schema: 'public',
    logging: !JSON.parse(configService.get('IS_PROD')),
    entities: ENTITIES,
    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
