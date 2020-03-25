import { Injectable } from '@nestjs/common'
import { UserEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/createUser.dto'
import { UserRepository } from './repositories/user.repository'
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/updateUser.dto'

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  public async findByEmail(userEmail: string): Promise<UserEntity> {
    return await this.repository.findOne({ email: userEmail })
  }

  async findById(id: string): Promise<UserEntity> {
    return await this.repository.findOne(id, { relations: ['lists'] })
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, Number(process.env.BCRYPT_SALTS))
  }

  async update(user: UserEntity, args: UpdateUserDto): Promise<UserEntity> {
    return await this.repository.save({
      ...user,
      ...args,
    })
  }

  async register(user: CreateUserDto): Promise<UserEntity> {
    const password = await this.hashPassword(user.password)

    const newUser: UserEntity = await this.repository.save({
      ...user,
      password,
    })

    return newUser
  }
}
