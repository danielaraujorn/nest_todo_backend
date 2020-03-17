import { Field, ObjectType } from '@nestjs/graphql'
import { TokenDto } from './token.dto'

@ObjectType()
export class AuthStatusDto {
  @Field()
  success: boolean

  @Field({ nullable: true })
  message?: string

  @Field(type => TokenDto, { nullable: true })
  token?: TokenDto
}
