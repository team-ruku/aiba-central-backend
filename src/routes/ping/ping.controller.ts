import { Controller, Get, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/auth";

import { PingService } from "./ping.service";

@Controller("ping")
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  ping(): string {
    return this.pingService.ping();
  }
}
