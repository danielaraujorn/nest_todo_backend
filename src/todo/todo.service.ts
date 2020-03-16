import { Injectable } from '@nestjs/common';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/createTodo.dto';
import { TodoRepository } from './repositories/todo.repository';
import { ListRepository } from 'src/list/repositories/list.repository';
import { ListEntity } from 'src/list/entities/list.entity';
import { FindTodosDto } from './dto/findTodos.dto';
import { ListTodosEntity } from './entities/listTodos.entity';
import { findOrder } from 'src/common/types/find-order.type';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly listRepository: ListRepository,
  ) {}

  async findById(id: string): Promise<TodoEntity> {
    return await this.todoRepository.findOne(id, { relations: ['list'] });
  }

  async upsert(
    id: string | undefined,
    todo: CreateTodoDto,
  ): Promise<TodoEntity> {
    const { listId, ...restTodo }: { listId?: string } = todo;

    const newTodo: TodoEntity = id
      ? await this.todoRepository.findOne(id, {
          relations: ['list'],
        })
      : new TodoEntity();

    if (listId) {
      const list: ListEntity = await this.listRepository.findOne(listId);
      newTodo.list = list;
    }

    await this.todoRepository.save({
      ...newTodo,
      ...restTodo,
    });

    return await this.todoRepository.findOne(newTodo.id, {
      relations: ['list'],
    });
  }

  async findTodos(params: FindTodosDto): Promise<ListTodosEntity> {
    const { skip, take, ids, listId, order, fieldSort } = params;

    const $order: findOrder = {
      [fieldSort]: order,
    };

    const $where = {
      _id: { $in: ids },
      list: { id: listId },
    };

    const [items, total]: [TodoEntity[], number] = await Promise.all([
      this.todoRepository.find({
        skip,
        take,
        relations: ['list'],
        where: $where,
        order: $order,
      }),
      this.todoRepository.count({ where: $where }),
    ]);

    return {
      items,
      total,
    };
  }
}
