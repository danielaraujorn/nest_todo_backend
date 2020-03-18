import { Injectable, Logger } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { CreateUserDto } from '../user/dto/createUser.dto'
import { UserEntity } from '../user/entities/user.entity'
import * as jwt from 'jsonwebtoken'
import { AuthStatusDto } from './dto/authStatus.dto'
import { compare as bcryptCompare } from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(AuthService.name)

  async register(user: CreateUserDto) {
    let status: AuthStatusDto = {
      success: true,
      message: 'user register',
    }
    try {
      await this.userService.register(user)
    } catch (err) {
      // debug(err);
      status = { success: false, message: err }
    }
    return status
  }

  createToken(user: UserEntity) {
    // debug('get the expiration');
    const expiresIn = 3600
    // debug('sign the token');
    // debug(user);

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn },
    )
    // debug('return the token');
    // debug(accessToken);
    return {
      expiresIn,
      accessToken,
    }
  }

  async validateUserToken(payload): Promise<UserEntity> {
    return await this.userService.findById(payload.id)
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userService.findByEmail(email)

    if (user && (await bcryptCompare(password, user.password))) {
      this.logger.log('password check success')
      return user
    }

    return null
  }
}
