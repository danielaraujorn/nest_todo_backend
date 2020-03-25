import { UseGuards } from '@nestjs/common'
import { Query, Mutation, Resolver, Args } from '@nestjs/graphql'
import { UserEntity } from './entities/user.entity'
import { UserService } from './user.service'
import { CurrentUser } from '../auth/decorators/currentUser.decorator'
import { GqlAuthGuard } from '../auth/decorators/gqlAuthGuard.decorator'
import { UserRO } from './users.ro'
import { UpdateUserDto } from './dto/updateUser.dto'

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserEntity)
  async ownUser(@CurrentUser() user): Promise<UserRO> {
    return user
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserEntity)
  async updateUser(
    @CurrentUser() user,
    @Args() args: UpdateUserDto,
  ): Promise<UserRO> {
    return await this.service.update(user, args)
  }
}
