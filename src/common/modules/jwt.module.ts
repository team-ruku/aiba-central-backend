import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

export const JwtOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET_KEY,
  global: true,
};

@Module({ imports: [JwtModule.register(JwtOptions)] })
export class CustomJwtModule {}
