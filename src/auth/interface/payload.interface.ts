import { Types } from "mongoose";

export interface AccessPayload {
  _id: Types.ObjectId;
  name: string;
  refresh: boolean;
}

export interface RefreshPayload {
  _id: Types.ObjectId;
  refresh: boolean;
}
