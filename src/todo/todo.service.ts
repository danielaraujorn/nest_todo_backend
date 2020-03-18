import { Injectable } from '@nestjs/common'
import { TodoEntity } from './entities/todo.entity'
import { CreateTodoDto } from './dto/createTodo.dto'
import { TodoRepository } from './repositories/todo.repository'
import { ListRepository } from '../list/repositories/list.repository'
import { ListEntity } from '../list/entities/list.entity'
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
      { id, list: { user: { id: user.id } } },
      { relations: ['list'] },
    )
  }

  async upsert(
    user: UserEntity,
    id: string | undefined,
    todo: CreateTodoDto,
  ): Promise<TodoEntity> {
    const { listId, ...restTodo }: { listId?: string } = todo

    const newTodo: TodoEntity = id
      ? await this.todoRepository.findOne(
          { id, list: { user: { id: user.id } } },
          {
            relations: ['list'],
          },
        )
      : new TodoEntity()
    if (!id && !listId) return undefined

    if (listId) {
      const list: ListEntity = await this.listRepository.findOne({
        id: listId,
        user: { id: user.id },
      })
      newTodo.list = list
    }

    await this.todoRepository.save({
      ...newTodo,
      ...restTodo,
    })

    return await this.todoRepository.findOne(newTodo.id, {
      relations: ['list'],
    })
  }

  async findTodos(
    user: UserEntity,
    params: FindTodosDto,
  ): Promise<ListTodosEntity> {
    const { skip, take, ids, listId, order, fieldSort } = params

    const $order: findOrder = {
      [fieldSort]: order,
    }

    const idsWhere = ids ? { _id: { $in: ids } } : {}
    const listIdWhere = listId ? { id: listId } : {}
    const userWhere = { list: { ...listIdWhere, user: { id: user.id } } }
    const $where = {
      ...idsWhere,
      ...userWhere,
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
