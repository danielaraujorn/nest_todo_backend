import { Field, InputType } from '@nestjs/graphql'

@InputType('CreateListInput')
export class CreateListDto {
  @Field()
  text: string
}
