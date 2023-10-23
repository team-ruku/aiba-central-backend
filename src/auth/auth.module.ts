import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CustomConfigModule, CustomJwtModule } from "src/common";

import { User, UserSchema, Token, TokenSchema } from "src/schemas";

import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./providers/auth.service";
import { JwtStrategy } from "./strategies";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    CustomConfigModule,
    CustomJwtModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
