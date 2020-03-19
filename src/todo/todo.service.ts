import { Injectable, UnauthorizedException } from '@nestjs/common'
import { TodoEntity } from './entities/todo.entity'
import { CreateTodoDto } from './dto/createTodo.dto'
import { TodoRepository } from './repositories/todo.repository'
import { ListRepository } from '../list/repositories/list.repository'
import { FindTodosDto } from './dto/findTodos.dto'
import { ListTodosEntity } from './entities/listTodos.entity'
import { findOrder } from '../common/types/find-order.type'
import { UserEntity } from '../user/entities/user.entity'

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly listRepository: ListRepository,
  ) {}

  async findById(user: UserEntity, id: string): Promise<TodoEntity> {
    return await this.todoRepository.findOne(
      { id, user: { id: user.id } },
      { relations: ['list'] },
    )
  }

  async upsert(
    user: UserEntity,
    id: string | undefined,
    { listId, ...newTodoInput }: CreateTodoDto,
  ): Promise<TodoEntity> {
    const list = await this.listRepository.findOne({
      id: listId,
      user: { id: user.id },
    })

    if (!list) throw new UnauthorizedException()

    if (id) {
      const todo = await this.todoRepository.findOne({
        id,
        user: { id: user.id },
      })
      if (!todo) throw new UnauthorizedException()
      return await this.todoRepository.save({
        ...todo,
        list,
        user,
        ...newTodoInput,
      })
    }
    return await this.todoRepository.save({ list, user, ...newTodoInput })
  }

  async findTodos(
    user: UserEntity,
    params: FindTodosDto,
  ): Promise<ListTodosEntity> {
    const { skip, take, ids, listId, order, fieldSort } = params

    const $order: findOrder = {
      [fieldSort]: order,
    }

    const idsWhere = ids ? { _id: { $in: ids } } : undefined
    const listIdWhere = listId ? { list: { id: listId } } : undefined
    const $where = {
      ...idsWhere,
      ...listIdWhere,
      user: { id: user.id },
    }

    const [items, total]: [TodoEntity[], number] = await Promise.all([
      this.todoRepository.find({
        skip,
        take,
        relations: ['list'],
        where: $where,
        order: $order,
      }),
      this.todoRepository.count({ where: $where }),
    ])

    return {
      items,
      total,
    }
  }
}
