import { Injectable, ForbiddenException } from '@nestjs/common'
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
    return await this.listRepository.findOne({
      id,
      user: { id: user.id },
    })
  }

  async find(user: UserEntity, params: FindListsDto): Promise<ListListsEntity> {
    const { skip, take, ids, order, fieldSort, deleted } = params
    const $order: findOrder = {
      [fieldSort]: order,
    }

    const idsWhere = ids ? { _id: { $in: ids } } : {}
    const $where = { ...idsWhere, deleted, user: { id: user.id } }

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
    newListInput: CreateListDto,
  ): Promise<ListEntity> {
    if (id) {
      const list = await this.listRepository.findOne(
        {
          id,
          user: { id: user.id },
        },
        { relations: ['todos'] },
      )
      if (!list) throw new ForbiddenException()
      return await this.listRepository.save({ ...list, user, ...newListInput })
    }
    return await this.listRepository.save({
      user,
      todos: [],
      ...newListInput,
    })
  }

  async delete(
    user: UserEntity,
    id: string,
    deleted: boolean,
  ): Promise<ListEntity> {
    const list = await this.listRepository.findOne({
      id,
      user: { id: user.id },
    })

    if (!list) throw new ForbiddenException()

    return await this.listRepository.save({ ...list, deleted })
  }
}
