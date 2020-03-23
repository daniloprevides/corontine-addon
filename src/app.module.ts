import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonsModule } from './commons/commons.module';
import { AddonModuleModule } from './addon-module/addon-module.module';
import configuration from './config/configuration';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';


const databaseModule: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (appConfigService: ConfigService) =>{
    return appConfigService.get(process.env.NODE_ENV === 'test' ? 'testDatabase' : 'database')
  }
};


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync(databaseModule),
    CommonsModule,
    AddonModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(){
    initializeTransactionalContext() 
  }

}
