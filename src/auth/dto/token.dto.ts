import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenDto {
  @Field()
  expiresIn: number;

  @Field()
  accessToken: string;
}
