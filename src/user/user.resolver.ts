import {
  // NotFoundException,
  UseGuards,
} from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { UserEntity } from './entities/user.entity'
// import { UserService } from './user.service'
import { CurrentUser } from '../auth/decorators/currentUser.decorator'
import { GqlAuthGuard } from '../auth/decorators/gqlAuthGuard.decorator'
import { UserRO } from './users.ro'

@Resolver(() => UserEntity)
export class UserResolver {
  // constructor(private readonly service: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => UserEntity)
  async ownUser(@CurrentUser() user): Promise<UserRO> {
    return user
  }
}
