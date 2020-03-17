import { NotFoundException, UseGuards } from '@nestjs/common';
import { Query, Mutation, Args, Resolver } from '@nestjs/graphql';
import { TodoEntity } from './entities/todo.entity';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpsertTodoDto } from './dto/upsertTodo.dto';
import { TodoService } from './todo.service';
import { ListTodosEntity } from './entities/listTodos.entity';
import { FindTodosDto } from './dto/findTodos.dto';
import { GqlAuthGuard } from 'src/auth/decorators/gqlAuthGuard.decorator';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Resolver(of => TodoEntity)
export class TodoResolver {
  constructor(private readonly service: TodoService) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => TodoEntity)
  async todo(
    @CurrentUser() user: UserEntity,
    @Args('id') id: string,
  ): Promise<TodoEntity> {
    const list = await this.service.findById(user, id);
    if (!list) {
      throw new NotFoundException(id);
    }
    return list;
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => ListTodosEntity)
  todos(
    @CurrentUser() user: UserEntity,
    @Args() queryArgs: FindTodosDto,
  ): Promise<ListTodosEntity> {
    return this.service.findTodos(user, queryArgs);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => TodoEntity)
  async saveTodo(
    @CurrentUser() user: UserEntity,
    @Args() mutationArgs: UpsertTodoDto,
  ): Promise<TodoEntity> {
    const {
      id,
      todoInput,
    }: { id?: string; todoInput: CreateTodoDto } = mutationArgs;

    return await this.service.upsert(user, id, todoInput);
  }
}
