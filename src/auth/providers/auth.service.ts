import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Types, Model } from "mongoose";

import { User, UserDocument, Token, TokenDocument } from "src/schemas";

import { TokenDto, TokensResponseDto } from "../dto";
import { AccessPayload, RefreshPayload } from "../interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Token.name)
    private tokenModel: Model<TokenDocument>,

    private readonly httpService: HttpService,
  ) {}

  async kakaoLogin(token: string): Promise<{
    id: number;
    name: string;
  }> {
    try {
      const { data: response } = await this.httpService.axiosRef.get(
        "https://kapi.kakao.com/v2/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        id: response.id,
        name: response.kakao_account.profile.nickname,
      };
    } catch (err) {
      throw new HttpException(
        "카카오 로그인에 실패했습니다.",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeExistingToken(token: string): Promise<void> {
    const existingToken = await this.tokenModel.findOneAndDelete({
      token,
    });

    if (!existingToken)
      throw new HttpException(
        "Refresh 토큰이 올바르지 않습니다. 다시 로그인해주세요.",
        HttpStatus.UNAUTHORIZED,
      );
  }

  async verify(token: string): Promise<AccessPayload | RefreshPayload> {
    try {
      const payload: AccessPayload | RefreshPayload =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>("JWT_SECRET_KEY"),
        });
      return payload;
    } catch (err) {
      if (err.name == "TokenExpiredError") {
        throw new HttpException(
          "토큰이 만료되었습니다.",
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        "인증되지 않은 토큰입니다.",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async createToken(userId: Types.ObjectId): Promise<TokensResponseDto> {
    const user = await this.userModel.findById(userId).lean();

    const accessToken = await this.jwtService.signAsync(
      { ...user, refresh: false },
      {
        algorithm: "HS512",
        secret: this.configService.get<string>("JWT_SECRET_KEY"),
        expiresIn: "30m",
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { _id: user._id, refresh: true },
      {
        algorithm: "HS512",
        secret: this.configService.get<string>("JWT_SECRET_KEY"),
        expiresIn: "1y",
      },
    );

    await new this.tokenModel({ user: user._id, token: refreshToken }).save();

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(data: TokenDto): Promise<TokensResponseDto> {
    const userInfo = await this.kakaoLogin(data.token);
    console.log(userInfo);

    const user = await this.userModel.findOneAndUpdate(
      { id: userInfo.id },
      { name: userInfo.name },
      { upsert: true, new: true },
    );

    return await this.createToken(user._id);
  }

  async refresh(data: TokenDto): Promise<TokensResponseDto> {
    const payload = await this.verify(data.token);
    if (!payload.refresh)
      throw new HttpException(
        "Refresh 토큰이 아닙니다.",
        HttpStatus.BAD_REQUEST,
      );
    await this.removeExistingToken(data.token);
    return await this.createToken(payload._id);
  }

  async logout(data: TokenDto): Promise<void> {
    const payload = await this.verify(data.token);
    if (!payload.refresh)
      throw new HttpException(
        "Refresh 토큰이 아닙니다.",
        HttpStatus.BAD_REQUEST,
      );
    await this.removeExistingToken(data.token);
  }
}
