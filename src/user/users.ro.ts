import { ListEntity } from 'src/list/entities/list.entity'
import { ObjectID } from 'typeorm'

export class UserRO {
  id: ObjectID
  email: string
  firstName: string
  lastName: string
  lists: ListEntity[]
}
