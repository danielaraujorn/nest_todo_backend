import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListResolver } from './list.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListRepository } from './repositories/list.repository';
import { ServiceHelper } from 'src/common/helpers/service.helper';

@Module({
  imports: [TypeOrmModule.forFeature([ListRepository])],
  providers: [ListService, ListResolver, ServiceHelper],
})
export class ListModule {}
