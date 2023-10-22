import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import importToArray from "import-to-array";
import * as moment from "moment-timezone";

import { EssentialModules, LoggerMiddleware } from "src/common";

import * as routes from "src/routes";

import { AppService } from "./app.service";

@Module({
  imports: [...EssentialModules, ...importToArray(routes)],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {
    moment.tz.setDefault("Asia/Seoul");
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
