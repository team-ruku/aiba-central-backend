import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule, MongooseModuleAsyncOptions } from "@nestjs/mongoose";

import { CustomConfigModule } from "./config.module";

export const Mongooseoptions: MongooseModuleAsyncOptions = {
  imports: [CustomConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>("MONGO_URI"),
    dbName: "aiba",

    connectionFactory: (connection) => {
      return connection;
    },
  }),
  inject: [ConfigService],
};

@Module({ imports: [MongooseModule.forRootAsync(Mongooseoptions)] })
export class CustomMongooseModule {}
