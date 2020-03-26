import { Max, Min, IsArray } from 'class-validator'
import { ArgsType, Field, Int, ID } from '@nestjs/graphql'
import { order } from '../../common/types/order.type'
import { ObjectID } from 'typeorm'

@ArgsType()
export class FindTodosDto {
  @Field(() => Int, { nullable: true })
  @Min(0)
  skip?: number = 0

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(50)
  take?: number = 100

  @Field(() => [ID], { nullable: true })
  @IsArray()
  ids?: string[]

  @Field(() => ID, { nullable: true })
  listId?: string | ObjectID

  @Field(() => Boolean, { nullable: true })
  deleted?: boolean = false

  @Field(() => String, { nullable: true })
  order?: order = 'DESC'

  @Field({ nullable: true })
  fieldSort?: string = 'createdAt'
}
