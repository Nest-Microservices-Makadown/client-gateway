import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError } from "rxjs";
import { NATS_SERVICE } from "src/config";
import { CreateOrderDto } from "src/orders/dto";

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post('register')
  registerUser() {
    console.log('AUTH / Gateway / Registering user...');
    return this.natsClient.send('auth.register.user', {}).pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Post('login')
  loginUser() {
    console.log('AUTH / Gateway / Login user...');
    return this.natsClient.send('auth.login.user', {}).pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Post('verify')
  verifyToken() {
    console.log('AUTH / Gateway / Verify token user...');
    return this.natsClient.send('auth.verify.user', {}).pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  
}