import { NewScopeDTO } from './new-scope.dto';
import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewClientCredentialsDTO {

  @ApiProperty()
  @IsArray()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  description?: string;

  @ApiProperty({type: Array})
  @IsArray()
  @IsOptional()
  scopes?: NewScopeDTO[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  apiUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  componentsUrl: string;

}
