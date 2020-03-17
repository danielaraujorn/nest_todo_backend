import { NotFoundException } from '@nestjs/common';
import { Query, Args, Resolver } from '@nestjs/graphql';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(of => UserEntity)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(returns => UserEntity)
  async user(@Args('id') id: string): Promise<UserEntity> {
    const user = await this.service.findById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }
}
