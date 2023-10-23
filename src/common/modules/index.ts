export * from "./swagger.module";
export * from "./config.module";
export * from "./database.module";
export * from "./jwt.module";
export * from "./schedule.module";

import { CustomConfigModule } from "./config.module";
import { CustomMongooseModule } from "./database.module";
import { CustomJwtModule } from "./jwt.module";
import { CustomScheduleModule } from "./schedule.module";

export const EssentialModules = [
  CustomConfigModule,
  CustomMongooseModule,
  CustomJwtModule,
  CustomScheduleModule,
];
