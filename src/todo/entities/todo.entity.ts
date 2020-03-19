import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Generated,
} from 'typeorm'
import { ListEntity } from '../../list/entities/list.entity'
import { UserEntity } from '../../user/entities/user.entity'

@Entity('Todo')
@ObjectType('Todo')
export class TodoEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'uuid' })
  @Generated('uuid')
  readonly id: ObjectID

  @Field()
  @Column({ default: '' })
  text: string

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date

  @Field()
  @Column({ default: false })
  completed: boolean

  @Field(() => ListEntity)
  @ManyToOne(
    () => ListEntity,
    list => list.todos,
  )
  list: ListEntity

  @Field(() => UserEntity)
  @ManyToOne(
    () => UserEntity,
    user => user.todos,
  )
  user: UserEntity
}
