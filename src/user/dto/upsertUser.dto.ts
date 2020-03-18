import { IsOptional } from 'class-validator'
import { ID, Field, ArgsType } from '@nestjs/graphql'
import { CreateUserDto } from './createUser.dto'

@ArgsType()
export class UpsertUserDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  id?: string

  @Field()
  userInput: CreateUserDto
}
