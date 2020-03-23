import { Scope } from "./scope.entity";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Audit } from "../../commons";
import { Expose } from "class-transformer";


@Entity({ name: "client-credentials" })
export class ClientCredentials extends Audit {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    name: "app_name",
    nullable: false,
    default: "addon",
    unique: false
  })
  name: string;

  @Column({
    type: "varchar",
    name: "app_description",
    nullable: true,
  })
  description?: string;

  @Column({
    type: "varchar",
    name: "api_uri",
    nullable: true,
  })
  apiUri?: string;

  @Column({
    type: "varchar",
    name: "authentication_uri",
    nullable: true,
  })
  authenticationUri?: string;

  @Column({
    name: "access_token",
    type: "text",
    nullable: true,
  })
  token?: string;

  @Column({
    name: "refresh_token",
    type: "text",
    nullable: true,
  })
  refreshToken?: string;

  @Column({
    type: "varchar",
    name: "token_expires_in",
    nullable: true,
  })
  tokenExpiresIn?: string;

  @Column({ type: "varchar", name: "client_name" , nullable: true})
  clientName: string;

  @Column({ type: "varchar", name: "client_secret" , nullable: true })
  secret: string;

  @Column({ type: "varchar" })
  code?: string;

  @ManyToMany<Scope>(
    () => Scope,
    (scope: Scope) => scope.credentials
  )
  @JoinTable({ name: "client-credentials_scopes" })
  @Expose()
  scopes: Scope[];

}
