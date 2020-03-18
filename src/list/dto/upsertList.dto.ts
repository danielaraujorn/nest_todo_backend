import { IsOptional } from 'class-validator'
import { ID, Field, ArgsType } from '@nestjs/graphql'
import { CreateListDto } from './createList.dto'

@ArgsType()
export class UpsertListDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  id?: string

  @Field()
  listInput: CreateListDto
}
