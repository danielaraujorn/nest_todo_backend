import { createParamDecorator } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContextHost) => {
    const [
      ,
      ,
      {
        req: { user },
      },
    ] = context.getArgs()
    return user
  },
)
