import { IsOptional } from 'class-validator'
import { ID, Field, ArgsType } from '@nestjs/graphql'
import { CreateTodoDto } from './createTodo.dto'

@ArgsType()
export class UpsertTodoDto {
  @Field(type => ID, { nullable: true })
  @IsOptional()
  id?: string

  @Field()
  todoInput: CreateTodoDto
}
