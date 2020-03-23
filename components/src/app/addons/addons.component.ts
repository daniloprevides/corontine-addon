import { BaseComponents } from '../base-components';
import {faPuzzlePiece} from '@fortawesome/free-solid-svg-icons'
import { FindParamsDto } from '../find-params.dto';
import { AppToastService } from '../services/notification-service';
import { addonService } from '../services/addon.service';
import { ViewEncapsulation, Input, ViewChild, Component, OnInit, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'addon-store',
  templateUrl: './addon.component.html',
  styleUrls: [
    './addon.component.css'
  ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AddonsComponent extends BaseComponents implements OnInit {

  @Input()
  public data:Array<any>;
  @ViewChild("modal") modal: ElementRef;

  constructor(private zone:NgZone, public toastService:AppToastService){
    super();
  }
  activeModel = 1;
  icon = faPuzzlePiece;
  model= {
    name: "",
    description: "",
    url: "",
    componentsUrl: ""
  }
  errors= {
    name: null,
    description: null,
    url: null,
    componentsUrl: null
  }
  scopeList = [];

  validate(){
    this.errors = {
      name: null,
      description: null,
      url: null,
      componentsUrl: null
    }

    if (!this.model.name || !this.model.name.length){
      this.errors.name = "Field cannot be empty";
    }
    if (!this.model.url || !this.model.url.length){
      this.errors.url = "Field cannot be empty";
    }
    if (!this.model.description || !this.model.description.length){
      this.errors.description = "Field cannot be empty";
    }
    if (!this.model.componentsUrl || !this.model.componentsUrl.length){
      this.errors.componentsUrl = "Field cannot be empty";
    }

    return this.errors.description === null && this.errors.name === null && this.errors.url === null && this.errors.componentsUrl === null;
  }

  async save(){
    if (this.validate()){
      const result = await this.createItem({
        name: this.model.name,
        description: this.model.description,
        apiUrl: this.model.url,
        componentsUrl: this.model.componentsUrl,
        environment: "DEVELOPMENT"
      });
      this.toastService.show("Success", "Your item was sucessfully added.");
      const dataResponse = await this.getList(new FindParamsDto());
      this.data = dataResponse.items;
      this.activeModel = 1;
    }
  }

  async createClientCredential(scopes: Array<any>, code, pluginInformation) {
    try {
      const authplugin = this.plugins.find(p => p.pluginType === "AUTH");
      const redirector = this.plugins.find(p => p.name === "redirector_api");

      const newClientCredential = await addonService.createClientCredential({
        name: pluginInformation.name,
        scopes: scopes
      },this.plugins,this.createItem) as any;

      //calling callback on plugin server
      return await addonService.setInformation(pluginInformation.redirect_uri, {
        scopes: newClientCredential.scopes,
        code: code,
        client_id: newClientCredential.name,
        secret: newClientCredential.secret,
        authentication_uri: authplugin.apiUrl,
        api_uri: `${redirector.apiUrl}/info`
      },this.updateItem);
    } catch (error) {
      console.error(error);
      //this.showErrorMessage(error);
    }
  }

  async addAddon(item){
    try {
      const scopesApi = this.plugins.find(p => p.name === "scopes_api");
      const scopesResponse = await this.getOne(`${scopesApi.apiUrl}`);
      this.scopeList = scopesResponse?.items;
      const pluginInformation = await addonService.getInfo(item.apiUrl,this.plugins,this.getOne);
      this.showAuthorization(pluginInformation);
    } catch (error) {
      console.error(error);
      // this.showErrorMessage(error);
    }
  }

  async showAuthorization(pluginInformation) {

    const code = pluginInformation.code;
    this.modal.nativeElement.renderer = (root, dialog) => {
      const pageView = document.createElement("permission-screen") as any;

      root.appendChild(pageView);

      customElements.whenDefined("permission-screen").then(d => {
        pageView.permission = pluginInformation;
        const requestedScopes = this.scopeList.filter(scope => {
          return (
            pluginInformation.scopes.find(s => s.name === scope.name) != null
          );
        });
        pageView.scopes = requestedScopes;

        pageView.addEventListener("permission-allowed", async () => {
          const result = await this.createClientCredential(
            requestedScopes,
            code,
            pluginInformation
          ) as any;
          this.modal.nativeElement.opened = false;
          if (result.requireLogoff) {
          } else {
            if (result.requireReload) {
            }
          }
        });

        pageView.addEventListener("permission-denied", () => {
          this.modal.nativeElement.opened = false;
        });
      });
    };

    this.modal.nativeElement.opened = true;
  }


  async ngOnInit(): Promise<void> {
    console.log("started");
  }

  async ngOnChanges(changes){
    if (this.getList){
      const data = await this.getList();
      this.zone.run(() => {
        this.data = data.items;
      })
    }
    console.log(changes);
  }


}
