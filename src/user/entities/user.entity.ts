import { Field, ID, ObjectType, HideField } from '@nestjs/graphql'
import {
  Column,
  Entity,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
  Unique,
} from 'typeorm'
import { ListEntity } from '../../list/entities/list.entity'
import { TodoEntity } from '../../todo/entities/todo.entity'

@Entity('User')
@ObjectType('User')
@Unique('UQ_NAMES', ['email'])
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'uuid' })
  @Generated('uuid')
  readonly id: ObjectID

  @Field()
  @Column()
  email: string

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column({ nullable: true })
  lastName?: string

  @HideField()
  @Column()
  password: string

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date

  @Field(() => [ListEntity])
  @OneToMany(
    () => ListEntity,
    list => list.user,
    { cascade: ['update'], eager: true },
  )
  lists: ListEntity[]

  @Field(() => [TodoEntity])
  @OneToMany(
    () => ListEntity,
    list => list.user,
    { cascade: ['update'], eager: true },
  )
  todos: ListEntity[]
}
