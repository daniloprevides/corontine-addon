import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "class-validator";

import { Expose } from "class-transformer";

export class GlobalInfoDto {
  @ApiProperty()
  @IsString()
  @Expose()
  description: string;

  @ApiProperty()
  @IsString()
  @Expose()
  version: string;

  @ApiProperty()
  @IsString()
  @Expose()
  documentation: string;

  @ApiProperty()
  @IsString()
  @Expose()
  url: string;
}
