import { NewScopeDTO } from './new-scope.dto';
import { IsEnum, IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientCredentialsDTO {

  @ApiProperty()
  @IsString()
  id: string;
  
  @ApiProperty()
  @IsString()
  clientName: string;

  @ApiProperty()
  @IsString()  
  @IsOptional()
  secret: string;

  @ApiProperty({type: Array})
  @IsArray()
  scopes: NewScopeDTO[];

}
