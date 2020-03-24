import { ID, Field, InputType } from '@nestjs/graphql'

@InputType('CreateTodoInput')
export class CreateTodoDto {
  @Field()
  text: string

  @Field(() => ID)
  listId: string

  @Field({ nullable: true })
  completed?: boolean
}
