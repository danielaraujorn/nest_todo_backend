import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IListItems } from '../../common/interfaces/list-items.interface';
import { ListEntity } from './list.entity';

@ObjectType('ListLists')
export class ListListsEntity implements IListItems {
  @Field(type => [ListEntity])
  items: ListEntity[];

  @Field(type => Int)
  total: number;
}
