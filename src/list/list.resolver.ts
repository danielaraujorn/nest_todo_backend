import { ID } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { Query, Mutation, Args, Resolver } from '@nestjs/graphql';
import { ListEntity } from './entities/list.entity';
import { ListListsEntity as ListLists } from './entities/listLists.entity';
import { CreateListDto } from './dto/createList.dto';
import { UpsertListDto } from './dto/upsertList.dto';
import { FindListsDto } from './dto/findLists.dto';
import { ListService } from './list.service';

@Resolver(of => ListEntity)
export class ListResolver {
  constructor(private readonly service: ListService) {}

  @Query(returns => ListEntity)
  async list(@Args('id') id: string): Promise<ListEntity> {
    const list = await this.service.findById(id);
    if (!list) {
      throw new NotFoundException(id);
    }
    return list;
  }

  @Query(returns => ListLists)
  lists(@Args() queryArgs: FindListsDto): Promise<ListLists> {
    return this.service.findLists(queryArgs);
  }

  @Mutation(returns => ListEntity)
  async saveList(@Args() mutationArgs: UpsertListDto): Promise<ListEntity> {
    const {
      id,
      listInput,
    }: { id?: string; listInput: CreateListDto } = mutationArgs;

    return await this.service.upsertList(id, listInput);
  }

  @Mutation(returns => Boolean)
  deactivateList(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.deactivateList(id);
  }
}
