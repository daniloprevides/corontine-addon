import { ClientCredentials } from './../entity/client-credentials.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { NewScopeDTO } from './new-scope.dto';
import { IsArray, IsOptional } from 'class-validator';

export class ClientCredentialsDTO {

  @ApiProperty({ type: Number })
  @Expose()
  id: ClientCredentials['id'];

  @ApiProperty({type: String})
  @Expose()
  clientName: ClientCredentials['clientName'];

  @ApiProperty({type: () => NewScopeDTO})
  @IsArray()
  @IsOptional()
  @Expose()
  @Type(() => NewScopeDTO)
  scopes: NewScopeDTO[];

}
