import { ID, Field, InputType } from '@nestjs/graphql'

@InputType('CreateTodoInput')
export class CreateTodoDto {
  @Field({ nullable: true })
  text?: string

  @Field(() => ID, { nullable: true })
  listId?: string

  @Field({ nullable: true })
  completed?: boolean
}
