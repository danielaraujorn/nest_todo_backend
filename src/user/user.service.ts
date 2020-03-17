import { Injectable } from '@nestjs/common'
import { UserEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/createUser.dto'
import { UserRepository } from './repositories/user.repository'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findByEmail(userEmail: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email: userEmail })
  }

  async findById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne(id, { relations: ['lists'] })
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, Number(process.env.BCRYPT_SALTS))
  }

  async register(user: CreateUserDto): Promise<UserEntity> {
    const password = await this.hashPassword(user.password)

    const newUser: UserEntity = await this.userRepository.save({
      ...user,
      password,
    })

    return newUser
  }
}
