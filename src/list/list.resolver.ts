import { NotFoundException, UseGuards } from '@nestjs/common'
import { Query, Mutation, Args, Resolver, ID } from '@nestjs/graphql'
import { ListEntity } from './entities/list.entity'
import { ListListsEntity } from './entities/listLists.entity'
import { CreateListDto } from './dto/createList.dto'
import { UpsertListDto } from './dto/upsertList.dto'
import { FindListsDto } from './dto/findLists.dto'
import { ListService } from './list.service'
import { GqlAuthGuard } from 'src/auth/decorators/gqlAuthGuard.decorator'
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator'
import { UserEntity } from 'src/user/entities/user.entity'

@Resolver(of => ListEntity)
export class ListResolver {
  constructor(private readonly service: ListService) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => ListEntity)
  async list(
    @CurrentUser() user: UserEntity,
    @Args('id') id: string,
  ): Promise<ListEntity> {
    const list = await this.service.findById(user, id)
    if (!list) {
      throw new NotFoundException(id)
    }
    return list
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => ListListsEntity)
  lists(
    @CurrentUser() user: UserEntity,
    @Args() args: FindListsDto,
  ): Promise<ListListsEntity> {
    return this.service.find(user, args)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ListEntity)
  async upsertList(
    @CurrentUser() user: UserEntity,
    @Args() args: UpsertListDto,
  ): Promise<ListEntity> {
    const { id, listInput }: { id?: string; listInput: CreateListDto } = args

    return await this.service.upsert(user, id, listInput)
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  deactivateList(
    @CurrentUser() user: UserEntity,
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.deactivate(user, id)
  }
}
