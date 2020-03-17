import { Field, InputType, ArgsType } from '@nestjs/graphql'

@ArgsType()
@InputType('LoginUserInput')
export class LoginUserDto {
  @Field()
  email: string

  @Field()
  password: string
}
