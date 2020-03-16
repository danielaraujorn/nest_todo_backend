import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ObjectID,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListEntity } from '../../list/entities/list.entity';

@Entity('Todo')
@ObjectType('Todo')
export class TodoEntity {
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
  completed: boolean;

  @Field(type => ListEntity)
  @ManyToOne(
    type => ListEntity,
    list => list.todos,
  )
  list: ListEntity;
}
