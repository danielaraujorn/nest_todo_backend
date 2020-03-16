import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListRepository } from './repositories/list.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ListRepository])],
  providers: [ListService, ListResolver],
})
export class ListModule {}
