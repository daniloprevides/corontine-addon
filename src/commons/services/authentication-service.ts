import { TokenExpiredError } from "jsonwebtoken";
import {
  Injectable,
  HttpService,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TokenDto } from "../dto/token.dto";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService
  ) {}

  public async getTokenInfo(authorizationHeader: string): Promise<TokenDto> {
    const url = `${this.configService.get(
      "authorizationUrl"
    )}/oauth/token/details`;
    let tokenDto: TokenDto = null;

    //Call authentication server to get token details
    try {
      const tokenDetailsResponse = await this.http
        .post(
          url,
          {},
          {
            headers: { Authorization: authorizationHeader }
          }
        )
        .toPromise();
      tokenDto = tokenDetailsResponse.data as TokenDto;
    } catch (ex) {
      if (ex.response?.data?.error?.code === "token_expired") {
        throw new UnauthorizedException(ex.response?.data?.error);
      }

    }
    return tokenDto;

  }

  public async authorize(
    authorizationHeader: string,
    scopes: string[],
    token?: TokenDto
  ): Promise<boolean> {
    if (!authorizationHeader) return false;

    let tokenDto: TokenDto = !token
      ? await this.getTokenInfo(authorizationHeader)
      : token;
    if (!tokenDto.scope || !tokenDto.scope.trim().length)
      throw new UnauthorizedException("User not found");
    const tokenScopes = token.scope.split(" ");

    let hasPermission = false;
    scopes.forEach(i => {
      if (tokenScopes.find(s => s == i) != null) {
        hasPermission = true;
      }
    });

    return hasPermission;
  }
}
