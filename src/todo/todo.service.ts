import { Injectable } from '@nestjs/common';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/createTodo.dto';
import { TodoRepository } from './repositories/todo.repository';
import { ListRepository } from 'src/list/repositories/list.repository';
import { ListEntity } from 'src/list/entities/list.entity';

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
    const { listId, ...restTodo }: { listId: string } = todo;

    const list: ListEntity = await this.listRepository.findOne(listId);

    const newTodo: TodoEntity = id
      ? await this.todoRepository.findOne(id, {
          relations: ['list'],
        })
      : new TodoEntity();

    return await this.todoRepository.save({
      ...newTodo,
      ...restTodo,
      list,
    });
  }

  async complete(id: string): Promise<boolean> {
    const todo: TodoEntity = await this.todoRepository.findOne(id, {
      relations: ['list'],
    });
    return Boolean(this.todoRepository.save({ ...todo, completed: false }));
  }
}
