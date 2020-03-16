import { ID, Field, InputType } from '@nestjs/graphql';

@InputType('CreateTodoInput')
export class CreateTodoDto {
  @Field()
  text: string;

  @Field(type => ID)
  listId: string;
}
