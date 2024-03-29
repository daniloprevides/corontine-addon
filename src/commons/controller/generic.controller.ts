import { FindParamsDto } from "./../dto/find-params.dto";
import { Mapper } from "../mapper/mapper";
import { BasicEntity } from "../entity/basic.entity";
import { GenericServiceInterface } from "../services/interface.generic.service";
import {
  Logger,
  Param,
  Body,
  Query,
  Req,
  UnauthorizedException,
  NotFoundException
} from "@nestjs/common";
import Request = require("request");
import { TokenDto } from "../dto/token.dto";
import { AuthenticationService } from "../services/authentication-service";
import { FieldNamesDto } from "../dto/field-names-dto";
import { ScopeEnum } from "../../addon-module/enum/scope.enum";
export abstract class GenericController<
  E extends BasicEntity,
  NEWDTO,
  UPDATEDTO,
  DTO,
  MAPPER extends Mapper<E, DTO>,
  S extends GenericServiceInterface<E, NEWDTO, UPDATEDTO>
> {
  logger: Logger;

  constructor(
    protected readonly service: S,
    protected readonly mapper: MAPPER,
    protected readonly authenticationService: AuthenticationService,
    protected readonly name: string
  ) {
    this.logger = new Logger(this.name);
  }

  protected isCmsCall(tokenDto: TokenDto): boolean {
    const scopes = tokenDto.scope.split(" ");
    return scopes.indexOf(ScopeEnum.CMS) >= 0;
  }


  public async getFieldNames(newItem:any, updateItem:any, listItem:any) : Promise<FieldNamesDto>{
    return this.service.getFieldNames(newItem,updateItem,listItem);
  }

  public getParentFieldName() { return null; };

  public async getAll(
    @Query() queryParams: FindParamsDto,
    @Req() req: Request
  ): Promise<DTO[]> {
    if (!req.headers.authorization) throw new UnauthorizedException();
    const localUrl = req.protocol + "://" + req.get("host");
    let tokenDto = await this.authenticationService.getTokenInfo(
      req.headers.authorization
    );
    let clientId = !this.isCmsCall(tokenDto) ? tokenDto.id : null;
    const url = req.protocol + "://" + req.get("host") + req.path;
    const paginatedItems = (await this.service.getAll(
      queryParams,
      url,
      clientId
    )) as any;
    paginatedItems.items = this.mapper.toDtoList(paginatedItems.items);
    return paginatedItems;
  }

  public async getById(
    @Param("id") id: E["id"],
    @Req() req: Request
  ): Promise<DTO> {
    if (!req.headers.authorization) throw new UnauthorizedException();
    const localUrl = req.protocol + "://" + req.get("host");
    let tokenDto = await this.authenticationService.getTokenInfo(
      req.headers.authorization
    );
    let clientId = !this.isCmsCall(tokenDto) ? tokenDto.id : null;

    return this.mapper.toDto(await this.service.findById(id, clientId));
  }

  public async getByName(
    @Param("name") name: string,
    @Req() req: Request
  ): Promise<DTO> {
    if (!req.headers.authorization) throw new UnauthorizedException();
    const localUrl = req.protocol + "://" + req.get("host");
    let tokenDto = await this.authenticationService.getTokenInfo(
      req.headers.authorization
    );
    let clientId = !this.isCmsCall(tokenDto) ? tokenDto.id : null;

    return this.mapper.toDto(await this.service.findByName(name, clientId));
  }

  async add(
    // eslint-disable-next-line @typescript-eslint/camelcase
    @Body() newItem: NEWDTO,
    @Req() req: Request
  ): Promise<DTO> {
    if (!req.headers.authorization) throw new UnauthorizedException();
    const localUrl = req.protocol + "://" + req.get("host");
    let tokenDto = await this.authenticationService.getTokenInfo(
      req.headers.authorization
    );
    let clientId = tokenDto.id;

    if (!this.isCmsCall(tokenDto)){
      const isValidCall = await this.service.validateParent(clientId, newItem[this.getParentFieldName()])
      if (!isValidCall){
        throw new NotFoundException();
      }
    }

    let item = await this.service.add(newItem, clientId);
    return this.mapper.toDto(item);
  }

  public async update(
    @Param("id") id: E["id"],
    @Body() updateInfo: UPDATEDTO,
    @Req() req: Request
  ): Promise<DTO> {
    if (!req.headers.authorization) throw new UnauthorizedException();
    const localUrl = req.protocol + "://" + req.get("host");
    let tokenDto = await this.authenticationService.getTokenInfo(
      req.headers.authorization
    );

    let clientId = tokenDto.id;
    if (!this.isCmsCall(tokenDto)){
      const isValidCall = await this.service.validateParent(tokenDto.id, updateInfo[this.getParentFieldName()]);
      if (!isValidCall){
        throw new NotFoundException();
      }
    }else{
      clientId = null;
    }

    return this.mapper.toDto(
      await this.service.update(id, updateInfo, clientId)
    );
  }

  public async delete(
    @Param("id") id: E["id"],
    @Req() req: Request
  ): Promise<void> {
    if (!req.headers.authorization) throw new UnauthorizedException();
    const localUrl = req.protocol + "://" + req.get("host");
    let tokenDto = await this.authenticationService.getTokenInfo(
      req.headers.authorization
    );
    let clientId = !this.isCmsCall(tokenDto) ? tokenDto.id : null;

    return await this.service.delete(id,clientId);
  }
}
