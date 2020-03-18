import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Generated,
  ManyToOne,
} from 'typeorm'
import { TodoEntity } from '../../todo/entities/todo.entity'
import { UserEntity } from 'src/user/entities/user.entity'

@Entity('List')
@ObjectType('List')
export class ListEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ type: 'uuid' })
  @Generated('uuid')
  readonly id: ObjectID

  @Field()
  @Column({ default: '' })
  text: string

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date

  @Field()
  @Column({ default: true })
  active: boolean

  @Field(() => [TodoEntity])
  @OneToMany(
    () => TodoEntity,
    todo => todo.list,
    { cascade: ['update'], eager: true },
  )
  todos: TodoEntity[]

  @Field(() => UserEntity)
  @ManyToOne(
    () => UserEntity,
    user => user.lists,
  )
  user: UserEntity
}
