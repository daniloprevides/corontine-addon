import { Injectable, Inject, HttpService, InternalServerErrorException } from "@nestjs/common";
import { GrantTypeEnum } from "../enum/grant-type.enum";
import { ClientCredentials } from "../entity/client-credentials.entity";
import { AuthDTO } from "../dto/auth.dto";

@Injectable()
export class CorontineService {

    constructor(private httpService:HttpService){

    }


    async getToken(clientCredential:ClientCredentials){
      try {
        const grant = new AuthDTO();
        grant.grant_type = GrantTypeEnum.CLIENT_CREDENTIALS;
        grant.client_id = clientCredential.clientName;
        grant.client_secret = clientCredential.secret;
        const axiosReturnedData = await this.httpService
          .post(`${clientCredential.authenticationUri}/oauth/token`, grant)
          .toPromise();
        return axiosReturnedData.data;

      }catch(error){
        console.error(error);
        throw error.data;
      }
    }

    async getRedirector(credentials: ClientCredentials) {
      try {
        const dataResponse = await this.httpService
        .get(`${credentials.apiUri}`,{
          headers: {
            Authorization: `Bearer: ${credentials.token}`
          }
        }).toPromise();
  
        return dataResponse.data;
  
      }catch(error){
        console.error(error);
        throw error.data;
      }
    }

    async create(pluginName:string, credentials:ClientCredentials, data:any){
      try {
        const redirector = await this.getRedirector(credentials);
        const plugin = redirector.plugins.find(r => r.name === pluginName);
        data.pluginType = "API";

        return await this.httpService.post(plugin.apiUrl,data,{
          headers: {
            'Authorization': `Bearer ${credentials.token}`
          }
        }).toPromise();
  
      }catch(error){
        console.error(error);
        throw error.data;
      }
    }

    async getCustomElementComponent(credentials) {
      try {
        const redirector = await this.getRedirector(credentials);
        const fields = redirector.plugins.find(r => r.name === "Fields");
        const allFieldsResponse = await this.httpService.get(fields.apiUrl,{
          headers: {
            'Authorization': `Bearer ${credentials.token}`
          }
        }).toPromise();

        return allFieldsResponse.data.items.find(ce => ce.name === 'custom-data');
  
      }catch(error){
        console.error(error);
        throw error.data;
      }
    }

    async addCustomPage(credentials:ClientCredentials, name:string, description:string, component:any, api:any, elementName:string) {
      try {
        const redirector = await this.getRedirector(credentials);
        const pages = redirector.plugins.find(r => r.name === "pages_api");
        const url = `${pages.apiUrl}/custom/page`;


        const newPageResponse = await this.httpService.post(url,{
          name: name,
          description: description,
          pageApi: api,
          api: api,
          component: component,
          elementName: elementName
        },{
          headers: {
            'Authorization': `Bearer ${credentials.token}`
          }
        }).toPromise();

        return newPageResponse.data
  
      }catch(error){
        console.error(error);
        throw error.data;
      }
    }

    async addScope(credentials:ClientCredentials, name:string, description:string) {
      try {
        const redirector = await this.getRedirector(credentials);
        const pages = redirector.plugins.find(r => r.name === "scopes_api");
        const url = `${pages.apiUrl}`;
        const scopeResponse = await this.httpService.post(url,{
          name: name,
          description: description,
        },{
          headers: {
            'Authorization': `Bearer ${credentials.token}`
          }
        }).toPromise();

        return scopeResponse.data
  
      }catch(error){
        console.error(error);
        throw error.data;
      }
    }

    async addEntryToCustomMenu(credentials:ClientCredentials, name:string, permission:string, page:any) {
      try {
        const redirector = await this.getRedirector(credentials);
        const pages = redirector.plugins.find(r => r.name === "menu_api");
        const url = `${pages.apiUrl}/add/entry`;
        const scopeResponse = await this.httpService.put(url,{
          name: name,
          requiredPermission: permission,
          pageName: page.name,
          pageId: page.id,          
        },{
          headers: {
            'Authorization': `Bearer ${credentials.token}`
          }
        }).toPromise();

        return scopeResponse.data
  
      }catch(error){
        console.error(error);
        throw error.data;
      }
    }

    async update(pluginName:string, credentials:ClientCredentials,id:string, data:any){
      const redirector = await this.getRedirector(credentials);
      const plugin = redirector.plugins.find(r => r.name === pluginName);
      return this.httpService.put(`${plugin.apiUrl}/${id}`,data,{
        headers: {
          Authorization: `Bearer: ${credentials.token}`
        }
      }).toPromise();
    }


}