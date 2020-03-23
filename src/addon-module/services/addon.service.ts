import { UpdateAddonDto } from "./../dto/update-plugin.dto";
import { GenericService } from "../../commons/services/generic.service";
import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException
} from "@nestjs/common";
import { Addon } from "../entity/addon.entity";
import { AddonRepository } from "../repository/addon.repository";
import { NewAddonDto } from "../dto/new-addon.dto";
import { AuthenticationService } from "../../commons/services/authentication-service";
import { NewPluginRequestDTO } from "../dto/new-plugin-request.dto";
import { v4 } from "uuid";
import { ClientCredentialsService } from "./client-credentials.service";
import { NewClientCredentialsDTO } from "../dto/new-client-credentials.dto";
import { ClientCredentials } from "../entity/client-credentials.entity";
import { NewScopeDTO } from "../dto/new-scope.dto";
import { AuthorizationCodeDTO } from "../dto/authorization-code.dto";
import { APIEnum } from "../api.enum";
import { ClientCredentialCallbackDTO } from "../dto/client-credential-callback.dto";

@Injectable()
export class AddonService extends GenericService<
  Addon,
  AddonRepository,
  NewAddonDto,
  UpdateAddonDto
> {

  constructor(
    @Inject(forwardRef(() => AddonRepository))
    public readonly addonRepository: AddonRepository,
    @Inject(forwardRef(() => AuthenticationService))
    protected readonly authenticationService: AuthenticationService,
    @Inject(forwardRef(() => ClientCredentialsService))
    protected readonly clientCredentialsService: ClientCredentialsService
  ) {
    super(addonRepository, "Addon");
  }

  async createPlugin(code: string) {
    //find the plugin by code
    const clientCredential = await this.repository.findOne({
      where: { code: code, consumed: false }
    });
    //Create client credential
  }

 

  public async validateParent(clientId: string, id: string): Promise<boolean> {
    return true;
  }

  protected getRelations(): Array<string> {
    return [];
  }
}
