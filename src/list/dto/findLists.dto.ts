import { Max, Min, IsArray } from 'class-validator';
import { ArgsType, Field, Int, ID } from '@nestjs/graphql';
import { order } from 'src/common/types/order.type';

@ArgsType()
export class FindListsDto {
  @Field(type => Int)
  @Min(0)
  skip: number = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  take: number = 50;

  @Field(type => [ID], { nullable: true })
  @IsArray()
  ids?: string[];

  @Field(type => String, { nullable: true })
  order?: order = 'DESC';

  @Field({ nullable: true })
  fieldSort?: string = 'updatedAt';
}
