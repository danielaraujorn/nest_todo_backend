import { Injectable } from '@nestjs/common';
import { ListEntity } from './entities/list.entity';
import { FindListsDto } from './dto/findLists.dto';
import { CreateListDto } from './dto/createList.dto';
import { ListListsEntity } from './entities/listLists.entity';
import { ListRepository } from './repositories/list.repository';
import { findOrder } from 'src/common/types/find-order.type';

@Injectable()
export class ListService {
  constructor(private readonly listRepository: ListRepository) {}

  async findById(id: string): Promise<ListEntity> {
    return await this.listRepository.findOne(id);
  }

  async find(params: FindListsDto): Promise<ListListsEntity> {
    const { skip, take, ids, order, fieldSort } = params;
    const $order: findOrder = {
      [fieldSort]: order,
    };
    const $where = ids ? { _id: { $in: ids } } : undefined;

    const [items, total]: [ListEntity[], number] = await Promise.all([
      this.listRepository.find({
        skip,
        take,
        where: $where,
        order: $order,
        relations: ['todos'],
      }),
      this.listRepository.count({
        where: $where,
      }),
    ]);

    return {
      items,
      total,
    };
  }

  async upsert(
    id: string | undefined,
    list: CreateListDto,
  ): Promise<ListEntity> {
    const newList: ListEntity = id
      ? await this.listRepository.findOne(id, {
          relations: ['list'],
        })
      : new ListEntity();

    await this.listRepository.save({
      ...newList,
      ...list,
    });

    return await this.listRepository.findOne(newList.id, {
      relations: ['todos'],
    });
  }

  async deactivate(id: string): Promise<boolean> {
    const list: ListEntity = await this.listRepository.findOne(id);
    return Boolean(this.listRepository.save({ ...list, active: false }));
  }
}
