import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument } from "mongoose";

import { schemaOptions } from "./options";

export type UserDocument = HydratedDocument<User>;
@Schema(schemaOptions)
export class User {
  @ApiProperty()
  @Prop({
    required: true,
    type: Number,
  })
  id: number;

  @ApiProperty()
  @Prop({
    required: true,
    type: String,
  })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
