import { Input } from '@angular/core';
import { FindParamsDto } from './find-params.dto';
import { PluginDto } from './plugin.dto';
import { PageModel } from './page-model.dto';

export interface PaginatedResponse<T = any>{
  items:Array<T>;
  itemCount: number;
  totalItems:number;
  pageCount:number;
  next:string;
  previous:string;
}

type getList<T = any> = (params?:FindParamsDto, url?: string) => Promise<PaginatedResponse<T>>;
type getOne<T = any> = (url?: string) => Promise<T>;
type createItem<T = any> = (item:any, url?: string) => Promise<T>;
type updateItem<T = any> = (item:any, url?: string, ) => Promise<T>;
type deleteItem = (id:string,url?: string) => Promise<void>;
type getFields = (url?: string) => Promise<Array<string>>;

export class BaseComponents {
    @Input()
    public plugins:Array<PluginDto>;
    @Input()
    public api:PluginDto;
    @Input()
    public pageapi:PluginDto;
    @Input()
    public scopes:Array<string>;
    @Input()
    public page:PageModel;

    @Input()
    public getList:getList;
    @Input()
    public getOne:getOne;
    @Input()
    public createItem:createItem;
    @Input()
    public updateItem:updateItem;
    @Input()
    public deleteItem:deleteItem;


}
