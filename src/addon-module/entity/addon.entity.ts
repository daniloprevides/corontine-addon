import { BasicEntity } from "./../../commons/entity/basic.entity";
import { Column, Entity, OneToMany, JoinColumn } from "typeorm";
import { Expose } from "class-transformer";
import { PluginEnvironmentEnum } from "../enum/environment.enum";

@Entity({ name: "addon" })
export class Addon extends BasicEntity {
  @Column({
    nullable: false,
    unique: true
  })
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column({ nullable: false, name: "components_url" })
  @Expose()
  componentsUrl: string;

  @Column({ nullable: false, name: "api_url" })
  @Expose()
  apiUrl: string;

  @Column({ nullable: false, default: true, type: Boolean })
  @Expose()
  enabled: boolean;

  @Column({ nullable: false, default: false, type: Boolean })
  @Expose()
  consumed: boolean;

  @Column({ nullable: false, default: "production" })
  @Expose()
  environment: PluginEnvironmentEnum;

}
