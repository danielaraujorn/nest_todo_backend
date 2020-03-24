import { Max, Min, IsArray } from 'class-validator'
import { ArgsType, Field, Int, ID } from '@nestjs/graphql'
import { order } from '../../common/types/order.type'

@ArgsType()
export class FindTodosDto {
  @Field(() => Int)
  @Min(0)
  skip: number = 0

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number = 50

  @Field(() => [ID], { nullable: true })
  @IsArray()
  ids?: string[]

  @Field(() => ID, { nullable: true })
  listId?: string

  @Field(() => Boolean, { nullable: true })
  deleted?: boolean = false

  @Field(() => String, { nullable: true })
  order?: order = 'DESC'

  @Field({ nullable: true })
  fieldSort?: string = 'updatedAt'
}
