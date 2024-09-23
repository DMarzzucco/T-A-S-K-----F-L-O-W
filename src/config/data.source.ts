// import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

// ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` })

// const configureService = new ConfigService()


export const DataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    // host: configureService.get<string>('DB_HOST'),
    // port: parseInt(configureService.get<string>('DB_PORT')),
    // username: configureService.get<string>('DB_USER'),
    // password: String(configureService.get<string>('DB_PASSWORD')),
    // database: configureService.get<string>('DB_NAME'),
    host:"localhost",
    port:5432,
    username:"user",
    password:"password",
    database:"data_base",
    entities: [__dirname + '/../**/**/*.entity.{ts,js}'],
    migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
}

export const AppDS = new DataSource(DataSourceConfig)