import { Injectable } from "@nestjs/common";
import { Mapper } from "../../commons/mapper";
import { Addon } from '../entity/addon.entity';
import { AddonDto } from "../dto/addon.dto";

@Injectable()
export class AddonMapper extends Mapper<Addon, AddonDto> {
  constructor() {
    super(Addon, AddonDto);
  }

  toDto(entityObject: Addon): AddonDto {
    return super.toDto(entityObject);
  }

  toDtoList(entityArray: Addon[]): AddonDto[] {
    return super.toDtoList(entityArray);
  }

  toEntity(dtoObject: AddonDto): Addon {
    return super.toEntity(dtoObject);
  }

  toEntityList(dtoArray: AddonDto[]): Addon[] {
    return super.toEntityList(dtoArray);
  }
}
