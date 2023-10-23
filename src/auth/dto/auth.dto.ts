import { IsString } from "nestjs-swagger-dto";

export class TokenDto {
  @IsString({
    description: "토큰",
  })
  token: string;
}

export class TokensResponseDto {
  @IsString({
    description: "액세스 토큰",
  })
  accessToken: string;

  @IsString({
    description: "리프레시 토큰",
  })
  refreshToken: string;
}
