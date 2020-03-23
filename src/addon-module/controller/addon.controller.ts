import { FieldNamesDto } from "./../../commons/dto/field-names-dto";
import { AuthenticationService } from "./../../commons/services/authentication-service";
import { FindParamsDto } from "./../../commons/dto/find-params.dto";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiHeader
} from "@nestjs/swagger";
import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Headers,
  UseGuards,
  UnauthorizedException,
  Req,
  Query,
  Redirect
} from "@nestjs/common";
import { GenericController } from "../../commons/controller/generic.controller";
import { ScopeEnum } from "../enum/scope.enum";
import Request = require("request");
import { NewAddonDto } from "../dto/new-addon.dto";
import { AddonDto } from "../dto/addon.dto";
import { APIEnum } from "../api.enum";
import { Addon } from "../entity/addon.entity";
import { AddonMapper } from "../mapper/addon.mapper";
import { AddonService } from "../services/addon.service";
import { UpdateAddonDto } from "../dto/update-plugin.dto";
import { NewPluginRequestDTO } from "../dto/new-plugin-request.dto";
import { AuthorizationCodeDTO } from "../dto/authorization-code.dto";
import { ClientCredentialCallbackDTO } from "../dto/client-credential-callback.dto";
import { ClientCredentialsService } from "../services/client-credentials.service";
import { NeedScope } from "../../commons/guard/scope-metadata.guard";
import { SecurityGuard } from "../../commons/guard/security.guard";

@ApiTags("Addon")
@ApiHeader({
  name: "authorization",
  allowEmptyValue: true,
  description: "Bearer Authorization token"
})
@Controller(`${APIEnum.PREFIX}/${APIEnum.ADDON_ENDPOINT}`)
export class AddonController extends GenericController<
  Addon,
  NewAddonDto,
  UpdateAddonDto,
  AddonDto,
  AddonMapper,
  AddonService
> {
  constructor(
    service: AddonService,
    public credentialsService: ClientCredentialsService,
    mapper: AddonMapper,
    authenticationService: AuthenticationService
  ) {
    super(service, mapper, authenticationService, "Addon");
  }

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: "Get Addon",
    description: "Get all Addon"
  })
  @ApiOkResponse({
    type: AddonDto,
    isArray: true,
    description: "All Addon"
  })
  @ApiQuery({
    type: FindParamsDto,
    name: "Pagination and Filter Params"
  })
  @ApiUnauthorizedResponse({
    description:
      "thrown if there is not an authorization token or if authorization token does not have enough privileges"
  })
  @NeedScope(ScopeEnum.ADDON_READ)
  @UseGuards(SecurityGuard)
  public async getAll(
    @Query() queryParams: FindParamsDto,
    @Req() req: Request
  ): Promise<AddonDto[]> {
    return super.getAll(queryParams, req);
  }

  @Get(":id")
  @HttpCode(200)
  @ApiOperation({
    summary: "Get Addon By Id",
    description: "Get Addon by Id"
  })
  @ApiOkResponse({
    type: AddonDto,
    isArray: false,
    description: "Get Addon by Id"
  })
  @ApiUnauthorizedResponse({
    description:
      "thrown if there is not an authorization token or if authorization token does not have enough privileges"
  })
  @NeedScope(ScopeEnum.ADDON_READ)
  @UseGuards(SecurityGuard)
  public async getById(
    @Param("id") id: Addon["id"],
    @Req() req: Request
  ): Promise<AddonDto> {
    return await super.getById(id, req);
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    type: AddonDto,
    description: "Addon created"
  })
  @ApiOperation({
    summary: "Add Addon",
    description: "Creates a new Addon"
  })
  @ApiBody({ type: NewAddonDto })
  @ApiUnauthorizedResponse({
    description:
      "thrown if there is not an authorization token or if authorization token does not have needed scopes"
  })
  @NeedScope(ScopeEnum.ADDON_CREATE)
  @UseGuards(SecurityGuard)
  async add(
    @Body() newItem: NewAddonDto,
    @Req() req: Request
  ): Promise<AddonDto> {
    return await super.add(newItem, req);
  }

  @Put(":id")
  @HttpCode(200)
  @ApiOkResponse({ type: AddonDto })
  @ApiOperation({
    summary: "Update Addon",
    description: "Updates the Addon By ID"
  })
  @ApiNotFoundResponse({ description: "Addon Not Found" })
  @ApiUnauthorizedResponse({
    description:
      "thrown if there is not an authorization token or if authorization token does not have enough privileges"
  })
  @NeedScope(ScopeEnum.ADDON_UPDATE)
  @UseGuards(SecurityGuard)
  public async update(
    @Param("id") id: Addon["id"],
    @Body() updateInfo: UpdateAddonDto,
    @Req() req: Request
  ): Promise<AddonDto> {
    return await super.update(id, updateInfo, req);
  }

  @Delete(":id")
  @HttpCode(200)
  @ApiParam({
    name: "id",
    type: Number,
    required: true,
    description: "Addon id"
  })
  @ApiOperation({
    summary: "Delete Addon",
    description: "Deletes Addon By ID"
  })
  @ApiNotFoundResponse({ description: "Addon Not Found" })
  @ApiUnauthorizedResponse({
    description:
      "thrown if there is not an authorization token or if authorization token does not have enough privileges"
  })
  @NeedScope(ScopeEnum.ADDON_DELETE)
  @UseGuards(SecurityGuard)
  public async delete(
    @Param("id") id: Addon["id"],
    @Req() req: Request
  ): Promise<void> {
    return await super.delete(id, req);
  }

  @Get("/field/names")
  @HttpCode(200)
  @ApiOperation({
    summary: "Get Field Names",
    description: "Get Field Names"
  })
  @NeedScope(ScopeEnum.ADDON_READ)
  @UseGuards(SecurityGuard)
  public async getFieldNames(object: any): Promise<FieldNamesDto> {
    return await super.getFieldNames(
      new NewAddonDto(),
      new UpdateAddonDto(),
      new AddonDto()
    );
  }

  @Get("/new/addon")
  @HttpCode(200)
  public async newAddonRequest(
    @Query() newPluginRequest: NewPluginRequestDTO,
    @Req() req: Request
  ): Promise<AuthorizationCodeDTO> {
    const url = req.protocol + "://" + req.get("host");
    return await this.credentialsService.getNewPluginData(
      newPluginRequest,
      url
    );
  }

  @Put("/code/callback")
  public async callback(
    @Req() req: Request,
    @Body() info: ClientCredentialCallbackDTO
  ) {
    return await this.credentialsService.authorizationGranted(info);
  }
}
