import { NotFoundException } from '@nestjs/common';
import { Query, Mutation, Args, Resolver } from '@nestjs/graphql';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpsertTodoDto } from './dto/upsertTodo.dto';
import { TodoService } from './todo.service';
import { ListTodosEntity } from './entities/listTodos.entity';
import { FindTodosDto } from './dto/findTodos.dto';

@Resolver(of => TodoEntity)
export class TodoResolver {
  constructor(private readonly service: TodoService) {}

  @Query(returns => TodoEntity)
  async todo(@Args('id') id: string): Promise<TodoEntity> {
    const list = await this.service.findById(id);
    if (!list) {
      throw new NotFoundException(id);
    }
    return list;
  }

  @Query(returns => ListTodosEntity)
  todos(@Args() queryArgs: FindTodosDto): Promise<ListTodosEntity> {
    return this.service.findTodos(queryArgs);
  }

  @Mutation(returns => TodoEntity)
  async saveTodo(@Args() mutationArgs: UpsertTodoDto): Promise<TodoEntity> {
    const {
      id,
      todoInput,
    }: { id?: string; todoInput: CreateTodoDto } = mutationArgs;

    return await this.service.upsert(id, todoInput);
  }
}
