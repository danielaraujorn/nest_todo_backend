import { Field, ArgsType } from '@nestjs/graphql'

@ArgsType()
export class UpdateUserDto {
  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  password?: string
}
