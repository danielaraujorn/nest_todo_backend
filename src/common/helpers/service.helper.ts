import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IWhereIds } from '../interfaces/where-ids.interface';

@Injectable()
export class ServiceHelper {
  async getUpsertData(
    id: string | undefined,
    fields: any,
    repository: Repository<any>,
  ): Promise<any> {
    if (id) {
      return {
        ...(await repository.findOne(id)),
        ...fields,
      };
    }

    return repository.create(fields);
  }

  getWhereByIds(ids: string[]): IWhereIds {
    const $where: IWhereIds = {
      _id: { $in: ids },
      active: true,
    };

    return $where;
  }
}
