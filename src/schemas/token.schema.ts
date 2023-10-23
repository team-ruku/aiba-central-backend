import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { HydratedDocument, Types } from "mongoose";

import { User } from "src/schemas";

import { schemaOptions } from "./options";

export type TokenDocument = HydratedDocument<Token>;
@Schema(schemaOptions)
@ApiExtraModels(User)
export class Token {
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(User) }],
  })
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: "User",
  })
  user: Types.ObjectId;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
