import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService:ConfigService){

  }
  getHello(url:string): any {
    const api = this.configService.get("api");
    return {
      description: api.description,
      version: api.version,
      documentation: `${url}${api.path}`,
      url: url 
    }
  }
}
