import { ClientCredentialsDTO } from "./../dto/client-credentials.dto";
import { ScopeRepository } from "./../repository/scope.repository";
import { NewClientCredentialsDTO } from "./../dto/new-client-credentials.dto";
import { ClientCredentials } from "./../entity/client-credentials.entity";
import { ClientCredentialsRepository } from "./../repository/client-credentials.repository";
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpService
} from "@nestjs/common";

import { Transactional } from "typeorm-transactional-cls-hooked";

import { Scope } from "../entity/scope.entity";
import { UpdateClientCredentialsDTO } from "../dto/update-client-credentials.dto";
import { v4 } from "uuid";
import { AuthorizationCodeDTO } from "../dto/authorization-code.dto";
import { APIEnum } from "../api.enum";
import { ClientCredentialCallbackDTO } from "../dto/client-credential-callback.dto";
import { NewPluginRequestDTO } from "../dto/new-plugin-request.dto";
import { NewScopeDTO } from "../dto/new-scope.dto";
import { AuthDTO } from "../dto/auth.dto";
import { GrantTypeEnum } from "../enum/grant-type.enum";
import { CorontineService } from "./corontine.service";
import { ScopeEnum } from "../enum/scope.enum";

@Injectable()
export class ClientCredentialsService {
  constructor(
    @Inject(forwardRef(() => ClientCredentialsRepository))
    private readonly repository: ClientCredentialsRepository,
    @Inject(forwardRef(() => ScopeRepository))
    private readonly scopeRepository: ScopeRepository,
    private httpService: HttpService,
    private corontineService: CorontineService
  ) {}

  @Transactional()
  public async getAll(): Promise<ClientCredentials[]> {
    return this.repository.find({
      relations: ["scopes"]
    });
  }

  @Transactional()
  public async findById(
    id: ClientCredentials["id"]
  ): Promise<ClientCredentials> {
    const credentials:
      | ClientCredentials
      | undefined = await this.repository.findOne(id, {
      relations: ["scopes"]
    });
    if (!credentials) {
      throw new NotFoundException("Credentials not found");
    }
    return credentials;
  }

  @Transactional()
  public async add(
    credential: NewClientCredentialsDTO
  ): Promise<ClientCredentials> {
    //Creating the scopes
    try {
      const savedItem = await this.repository.save(credential);

      return savedItem;
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY" || e.code === "SQLITE_CONSTRAINT") {
        throw new ConflictException("Client Credential Already Exists");
      }
      throw new InternalServerErrorException(e.message);
    }
  }

  @Transactional()
  public async delete(id: ClientCredentials["id"]): Promise<void> {
    await this.findById(id);
    await this.repository.delete(id);
  }

  @Transactional()
  public async getNewPluginData(
    newPluginRequest: NewPluginRequestDTO,
    url: string
  ): Promise<AuthorizationCodeDTO> {
    if (!newPluginRequest.callback_uri) {
      throw new BadRequestException("Callback url is missing");
    }

    const code = v4();
    const scope = this.getScopes();
    const nameAndDescription = this.getNameAndDescription();
    const credential = this.getCredential(
      newPluginRequest,
      v4(),
      code,
      scope,
      nameAndDescription.name,
      nameAndDescription.description
    );

    const clientCredential = await this.add(credential);

    return new AuthorizationCodeDTO(
      clientCredential.name,
      clientCredential.description,
      clientCredential.scopes,
      clientCredential.code,
      `${url}${APIEnum.PREFIX}/addon/code/callback`
    );
  }

  @Transactional()
  public async authorizationGranted(info: ClientCredentialCallbackDTO) {
    const authorizationItem = await this.repository.findOne({
      where: {
        code: info.code
      }
    });

    if (!authorizationItem) {
      throw new NotFoundException("Code not found");
    }

    authorizationItem.clientName = info.client_id;
    authorizationItem.secret = info.secret;
    authorizationItem.authenticationUri = info.authentication_uri;
    authorizationItem.apiUri = info.api_uri;

    try {
      let clientCredential = await this.repository.save(authorizationItem);
      const tokenInfo = await this.corontineService.getToken(clientCredential);
      clientCredential.token = tokenInfo.accessToken;
      clientCredential.refreshToken = tokenInfo.refreshToken;
      clientCredential.tokenExpiresIn = tokenInfo.expiresIn;
      clientCredential = await this.repository.save(authorizationItem);
      return await this.createResources(clientCredential);
    } catch (ex) {
      throw new InternalServerErrorException(ex);
    }
  }

  private async createResources(credentials: ClientCredentials) {
    const pluginResponse = await this.corontineService.create(
      "Plugins",
      credentials,
      {
        name: "MyPlugin",
        apiUrl: "http://localhost:5000/api/v1/addon",
        componentsUrl: "http://localhost:5000/components",
        environment: "DEVELOPMENT",
        components: [
          {
            name: "MyComponent",
            url: "http://localhost:5000/components/components.js"
          }
        ]
      }
    );

    const newPlugin = pluginResponse.data;

    //Searching for custom element component
    const component = await this.corontineService.getCustomElementComponent(
      credentials
    );
    const customPageResponse = await this.corontineService.addCustomPage(
      credentials,
      "teste",
      "description teste",
      component,
      newPlugin,
      "addon-store"
    );

    //Creating the scopes
    await this.corontineService.addScope(credentials, ScopeEnum.ADDON_CREATE, "Create a new addon");
    await this.corontineService.addScope(credentials, ScopeEnum.ADDON_READ, "Read an addon");
    await this.corontineService.addScope(credentials, ScopeEnum.ADDON_UPDATE, "Update an addon");
    await this.corontineService.addScope(credentials, ScopeEnum.ADDON_DELETE, "Delete an addon");

    //ading entry to custom menu
    const menu = await this.corontineService.addEntryToCustomMenu(credentials,"Addon",ScopeEnum.ADDON_READ,customPageResponse);

    console.log(menu);

    return {
      requireLogoff: true,
      requireReload: true
    };
  }

  private getCredential(
    newPluginRequest: NewPluginRequestDTO,
    state: string,
    code: string,
    scopes: string,
    name: string,
    description: string
  ) {
    const credential = new NewClientCredentialsDTO();
    credential.code = code;
    credential.name = name;
    credential.description = description;
    credential.apiUrl = newPluginRequest.callback_uri;
    credential.state = state;
    credential.scopes = scopes.split(" ").map(s => {
      const scope = new NewScopeDTO();
      scope.name = s;

      return scope;
    });
    return credential;
  }

  private getScopes(): string {
    const scope = `token_info page_create page_update page_delete page_read 
    plugin_create plugin_update plugin_delete plugin_read 
    components_create components_update components_delete components_read 
    fields_read scope_create menu_add_entry`;

    return scope;
  }

  public getNameAndDescription(): { name: string; description: string } {
    return {
      name: "Addon",
      description: "Addon Manager"
    };
  }

  @Transactional()
  public async update(
    id: ClientCredentials["id"],
    updateInfo: UpdateClientCredentialsDTO
  ): Promise<ClientCredentialsDTO> {
    const credential: ClientCredentials = await this.findById(id);
    if (!credential) {
      throw new BadRequestException("Invalid item");
    }

    let scopes = new Array<Scope>();
    if (updateInfo.scopes) {
      for (let scope of updateInfo.scopes) {
        let currentScope = await this.scopeRepository.findOne({
          where: { name: scope.name }
        });
        if (!currentScope) {
          currentScope = await this.scopeRepository.save(scope);
        }
        scopes.push(currentScope);
      }
    }

    return await this.repository.save({
      name: updateInfo.clientName,
      secret: updateInfo.secret ? updateInfo.secret : credential.secret,
      scopes: scopes
    });
  }
}
