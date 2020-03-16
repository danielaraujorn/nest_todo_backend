import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { ListEntity } from '../entities/list.entity';

@EntityRepository(ListEntity)
export class ListRepository extends Repository<ListEntity> {}
