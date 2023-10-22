import { SchemaOptions } from "@nestjs/mongoose";

export const schemaOptions: SchemaOptions = {
  timestamps: false,
  versionKey: false,
};
