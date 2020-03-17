import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ListModule } from './list/list.module'
import { TodoModule } from './todo/todo.module'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import 'dotenv'

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: process.env.NODE_ENV === 'development',
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({ autoLoadEntities: true }),
    ListModule,
    TodoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
