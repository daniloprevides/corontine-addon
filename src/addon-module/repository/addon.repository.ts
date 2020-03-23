import { EntityRepository, Repository } from "typeorm";
import { Addon } from '../entity/addon.entity';

@EntityRepository(Addon)
export class AddonRepository extends Repository<Addon> {
   
}
