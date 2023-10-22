import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "./app";
import { SwaggerSetup } from "./common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet({ contentSecurityPolicy: false }));

  await SwaggerSetup(app);

  await app.listen(3000);
}

bootstrap();
