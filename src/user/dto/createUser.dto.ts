import { Field, InputType, ArgsType } from '@nestjs/graphql';

@ArgsType()
@InputType('CreateUserInput')
export class CreateUserDto {
  @Field()
  firstName: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
