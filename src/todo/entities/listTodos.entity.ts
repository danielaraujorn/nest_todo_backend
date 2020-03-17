import { Field, ObjectType, Int } from '@nestjs/graphql'
import { IListItems } from '../../common/interfaces/list-items.interface'
import { TodoEntity } from './todo.entity'

@ObjectType('ListTodos')
export class ListTodosEntity implements IListItems {
  @Field(type => [TodoEntity])
  items: TodoEntity[]

  @Field(type => Int)
  total: number
}
