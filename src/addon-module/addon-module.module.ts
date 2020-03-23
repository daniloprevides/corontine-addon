import { Module } from '@nestjs/common';
import { AddonController } from './controller/addon.controller';
import { AddonRepository } from './repository/addon.repository';
import { AddonService } from './services/addon.service';
import { AddonMapper } from './mapper/addon.mapper';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Addon } from './entity/addon.entity';
import { CommonsModule } from '../commons/commons.module';
import { Scope } from './entity/scope.entity';
import { ScopeRepository } from './repository/scope.repository';
import { ClientCredentials } from './entity/client-credentials.entity';
import { ClientCredentialsRepository } from './repository/client-credentials.repository';
import { ClientCredentialsService } from './services/client-credentials.service';
import { CorontineService } from './services/corontine.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([
          Addon,
          AddonRepository,
          Scope,
          ScopeRepository,
          ClientCredentials,
          ClientCredentialsRepository
        ]),
        CommonsModule
      ],
      controllers: [
        AddonController,
      ],
      providers: [
        AddonService,
        ClientCredentialsService,
        AddonMapper,
        CorontineService
      ],
      exports: [
        AddonService,
      ]
})
export class AddonModuleModule {}
