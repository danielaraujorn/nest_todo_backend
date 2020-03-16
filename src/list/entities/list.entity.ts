import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TodoEntity } from '../../todo/entities/todo.entity';

@Entity('List')
@ObjectType('List')
export class ListEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn({ type: 'uuid' })
  readonly id: ObjectID;

  @Field()
  @Column({ default: '' })
  text: string;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @Field()
  @Column({ default: true })
  active: boolean;

  @Field(type => [TodoEntity])
  @OneToMany(
    type => TodoEntity,
    todo => todo.list,
    { cascade: ['update'], eager: true },
  )
  todos: TodoEntity[];
}
