import { ScopeEnum } from './../enum/scope.enum';
import { ClientCredentials } from './client-credentials.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinColumn } from 'typeorm';
import { Audit } from '../../commons/entity';
import { Expose } from 'class-transformer';
import { BasicEntity } from '../../commons/entity/basic.entity';

@Entity({name: 'scope'})
export class Scope extends BasicEntity {


  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description: string;

  @ManyToMany<ClientCredentials>(
    () => ClientCredentials,
    (credentials: ClientCredentials) => credentials.scopes,
  )
  @Expose()
  credentials: ClientCredentials[];

}
