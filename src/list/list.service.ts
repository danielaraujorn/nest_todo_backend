import { Injectable } from '@nestjs/common'
import { ListEntity } from './entities/list.entity'
import { FindListsDto } from './dto/findLists.dto'
import { CreateListDto } from './dto/createList.dto'
import { ListListsEntity } from './entities/listLists.entity'
import { ListRepository } from './repositories/list.repository'
import { findOrder } from '../common/types/find-order.type'
import { UserEntity } from '../user/entities/user.entity'

@Injectable()
export class ListService {
  constructor(private readonly listRepository: ListRepository) {}

  async findById(user: UserEntity, id: string): Promise<ListEntity> {
    return await this.listRepository.findOne({ id, user: { id: user.id } })
  }

  async find(user: UserEntity, params: FindListsDto): Promise<ListListsEntity> {
    const { skip, take, ids, order, fieldSort } = params
    const $order: findOrder = {
      [fieldSort]: order,
    }

    const idsWhere = ids ? { _id: { $in: ids } } : {}
    const $where = { ...idsWhere, user: { id: user.id } }

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
    ])

    return {
      items,
      total,
    }
  }

  async upsert(
    user: UserEntity,
    id: string | undefined,
    list: CreateListDto,
  ): Promise<ListEntity> {
    const newList: ListEntity = id
      ? await this.listRepository.findOne(
          { id, user: { id: user.id } },
          {
            relations: ['list'],
          },
        )
      : new ListEntity()

    await this.listRepository.save({
      ...newList,
      ...list,
      user,
    })

    return await this.listRepository.findOne(newList.id, {
      relations: ['todos', 'user'],
    })
  }

  async deactivate(user: UserEntity, id: string): Promise<boolean> {
    const list: ListEntity = await this.listRepository.findOne({
      id,
      user: { id: user.id },
    })
    return Boolean(this.listRepository.save({ ...list, active: false }))
  }
}
