import { EntityRepository, Repository } from 'typeorm';
import { ClientCredentials } from '../entity/client-credentials.entity';

@EntityRepository(ClientCredentials)
export class ClientCredentialsRepository extends Repository<ClientCredentials> {

  async findByNameAndSecret(clientName: string, secret: string) {
    return this.findOne({ clientName, secret }, { });
  }
  
}
