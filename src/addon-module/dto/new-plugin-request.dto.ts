import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsBoolean, IsFQDN } from "class-validator";

export class NewPluginRequestDTO {
  @ApiProperty()
  @IsString()
  @Expose()
  callback_uri: string;

}
