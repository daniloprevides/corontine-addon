import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ScopeEnum } from "../enum/scope.enum";
import { IsEnum, IsString, IsOptional, IsArray } from "class-validator";
import { ListComponent, ExposeFieldName, ExposeFieldNamesForPage, ComponentDefinition, PageRequirePermission, PermissionsDefinition } from "../../commons/annotations/expose-field-name.decorator";

export class ScopeDTO {
  @ApiProperty({ type: String })
  @Expose()
  @ExposeFieldName
  @ExposeFieldNamesForPage(new ComponentDefinition("label", {order: 1, visible: false}))
  id: string;

  @ApiProperty({ type: String })
  @IsString()
  @Expose()
  @ExposeFieldName
  @ExposeFieldNamesForPage(new ComponentDefinition("label", {order: 2, visible: true}))
  name: ScopeEnum | any;

  @ApiProperty({ type: String })
  @IsOptional()
  @Expose()
  @ExposeFieldName
  @ExposeFieldNamesForPage(new ComponentDefinition("label", {order: 3, visible: true}))
  description: string;

}
