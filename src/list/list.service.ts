import { Injectable } from '@nestjs/common';
import { ListEntity } from './entities/list.entity';
import { FindListsDto } from './dto/findLists.dto';
import { ServiceHelper } from '../common/helpers/service.helper';
import { CreateListDto } from './dto/createList.dto';
import { ListListsEntity } from './entities/listLists.entity';
import { ListRepository } from './repositories/list.repository';
import { findOrder } from 'src/common/types/find-order.type';
import { IWhereIds } from 'src/common/interfaces/where-ids.interface';

@Injectable()
export class ListService {
  constructor(
    private readonly serviceHelper: ServiceHelper,
    private readonly listRepository: ListRepository,
  ) {}

  async findById(id: string): Promise<ListEntity> {
    return await this.listRepository.findOne(id);
  }

  async findLists(params: FindListsDto): Promise<ListListsEntity> {
    const { skip, take, ids, order, fieldSort } = params;
    const $order: findOrder = { [fieldSort]: order };
    const $where: IWhereIds | undefined = ids
      ? this.serviceHelper.getWhereByIds(ids)
      : undefined;

    const [result, count]: [any[], any[]] = await Promise.all([
      this.listRepository.find({
        skip,
        take,
        where: $where,
        order: $order,
        relations: ['todos'],
      }),
      this.listRepository.find({
        where: $where,
      }),
    ]);

    return {
      items: result,
      total: count.length,
    };
  }

  async upsertList(
    id: string | undefined,
    list: CreateListDto,
  ): Promise<ListEntity> {
    const newList: ListEntity = await this.listRepository.findOne(id);
    return await this.listRepository.save({
      ...newList,
      ...list,
    });
  }

  async deactivateList(id: string): Promise<boolean> {
    const list: ListEntity = await this.listRepository.findOne(id);
    return Boolean(this.listRepository.save({ ...list, active: false }));
  }
}
