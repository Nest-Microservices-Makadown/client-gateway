import { Body, Controller, Inject, Post, Req, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs";
import { NATS_SERVICE } from "src/config";
import { LoginUserDto, RegisterUserDto } from "./dto";
import { AuthGuard } from "./guards/auth.guard";
import { User, Token } from "./decorators";
import { CurrentUser } from "./interfaces/current-user";

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto ) {
    return this.natsClient.send('auth.register.user', registerUserDto).pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.natsClient.send('auth.login.user', loginUserDto).pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    // The Guard does all the work for us, so we can just return user and token
    return {user, token};
  }
}