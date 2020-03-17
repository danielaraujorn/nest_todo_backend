import { Field, ID, ObjectType } from '@nestjs/graphql'
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
import { ListEntity } from 'src/list/entities/list.entity'

@Entity('User')
@ObjectType('User')
@Unique('UQ_NAMES', ['email'])
export class UserEntity {
  @Field(type => ID)
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

  @Column()
  password: string

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date

  @Field(type => [ListEntity])
  @OneToMany(
    type => ListEntity,
    list => list.user,
    { cascade: ['update'], eager: true },
  )
  lists: ListEntity[]
}
