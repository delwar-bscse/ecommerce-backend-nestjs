import { DataSource, DataSourceOptions} from 'typeorm'
import { config }  from 'dotenv';

config();

export const dataSourceOptions:DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  synchronize: true,
  logging: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource