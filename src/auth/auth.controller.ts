import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs";
import { NATS_SERVICE } from "src/config";
import { CreateOrderDto } from "src/orders/dto";
import { LoginUserDto, RegisterUserDto } from "./dto";

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

  @Post('verify')
  verifyToken() {
    return this.natsClient.send('auth.verify.user', {}).pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  
}