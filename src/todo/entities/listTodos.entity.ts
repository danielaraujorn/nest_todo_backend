import { Field, ObjectType, Int } from '@nestjs/graphql'
import { IListItems } from '../../common/interfaces/list-items.interface'
import { TodoEntity } from './todo.entity'

@ObjectType('ListTodos')
export class ListTodosEntity implements IListItems {
  @Field(() => [TodoEntity])
  items: TodoEntity[]

  @Field(() => Int)
  total: number
}
