import { Injectable } from "@nestjs/common";

@Injectable()
export class PingService {
  constructor() {}

  ping(): string {
    return "pong";
  }
}
