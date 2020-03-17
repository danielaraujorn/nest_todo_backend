import { Mutation, Args, Resolver } from '@nestjs/graphql'
import { UserEntity } from 'src/user/entities/user.entity'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/user/dto/createUser.dto'
import { LoginUserDto } from './dto/loginUser.dto'
import { AuthStatusDto } from './dto/authStatus.dto'

@Resolver(of => UserEntity)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(returns => AuthStatusDto)
  async register(@Args() args: CreateUserDto): Promise<AuthStatusDto> {
    const status = await this.service.register(args)
    if (!status.success) return status

    const { email, password }: LoginUserDto = args
    return this.login({ email, password })
  }

  @Mutation(returns => AuthStatusDto)
  async login(@Args() args: LoginUserDto): Promise<AuthStatusDto> {
    const { email, password }: { email: string; password: string } = args
    const user = await this.service.validateUser(email, password)
    if (!user) {
      return { success: false, message: 'User Not Found' }
    } else {
      // debug('start getting the token');
      const token = this.service.createToken(user)
      // debug(token.accessToken);
      return { success: true, token }
    }
  }
}
