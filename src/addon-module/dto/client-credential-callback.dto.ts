import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsFQDN } from "class-validator";
import { Scope } from "../entity/scope.entity";

export class ClientCredentialCallbackDTO {

  @ApiProperty()
  @IsString()
  @Expose()
  client_id: string;

  @ApiProperty()
  @IsString()
  @Expose()
  secret: string;

  @ApiProperty()
  @IsString()
  @Expose()
  code: string;

  @ApiProperty()
  @IsString()
  @Expose()
  authentication_uri: string;

  @ApiProperty()
  @IsString()
  @Expose()
  api_uri: string;

  @ApiProperty({type: () => Scope})
  @Expose()
  scopes: Array<Scope>;

}
