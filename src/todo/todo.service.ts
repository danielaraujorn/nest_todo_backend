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
      { id, list: { user: { id: user.id } } },
      { relations: ['list'] },
    )
  }

  async upsert(
    user: UserEntity,
    id: string | undefined,
    todo: CreateTodoDto,
  ): Promise<TodoEntity> {
    const { listId, ...newTodoInput }: { listId?: string } = todo

    const list = await this.listRepository.findOne({
      id: listId,
      user: { id: user.id },
    })

    if (!list) throw new UnauthorizedException()

    if (id) {
      const { list: todoList, ...todo } = await this.todoRepository.findOne({
        id,
      })
      if (!todo) throw new UnauthorizedException()
      return await this.todoRepository.save({
        list,
        ...todo,
        ...newTodoInput,
      })
    }
    return await this.todoRepository.save({ list, ...newTodoInput })
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
