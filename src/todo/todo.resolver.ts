import { NotFoundException, UseGuards } from '@nestjs/common'
import { Query, Mutation, Args, Resolver, ID } from '@nestjs/graphql'
import { TodoEntity } from './entities/todo.entity'
import { CreateTodoDto } from './dto/createTodo.dto'
import { UpsertTodoDto } from './dto/upsertTodo.dto'
import { TodoService } from './todo.service'
import { ListTodosEntity } from './entities/listTodos.entity'
import { FindTodosDto } from './dto/findTodos.dto'
import { GqlAuthGuard } from '../auth/decorators/gqlAuthGuard.decorator'
import { CurrentUser } from '../auth/decorators/currentUser.decorator'
import { UserEntity } from '../user/entities/user.entity'

@Resolver(() => TodoEntity)
export class TodoResolver {
  constructor(private readonly service: TodoService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => TodoEntity)
  async todo(
    @CurrentUser() user: UserEntity,
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<TodoEntity> {
    const list = await this.service.findById(user, id)
    if (!list) {
      throw new NotFoundException(id)
    }
    return list
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ListTodosEntity)
  todos(
    @CurrentUser() user: UserEntity,
    @Args() args: FindTodosDto,
  ): Promise<ListTodosEntity> {
    return this.service.findTodos(user, args)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TodoEntity)
  async upsertTodo(
    @CurrentUser() user: UserEntity,
    @Args() args: UpsertTodoDto,
  ): Promise<TodoEntity> {
    const { id, todoInput }: { id?: string; todoInput: CreateTodoDto } = args

    return await this.service.upsert(user, id, todoInput)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TodoEntity)
  async deleteTodo(
    @CurrentUser() user: UserEntity,
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('deleted') deleted: boolean,
  ): Promise<TodoEntity> {
    return await this.service.delete(user, id, deleted)
  }
}
