import { Catch,  ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Observable} from 'rxjs';
import { RpcException } from '@nestjs/microservices';

/**
 * Este es nuestro filtro de excepciones personalizado.
 * More info here:
 * https://docs.nestjs.com/microservices/exception-filters
 */
@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost) {
    console.log('Aplicando nuestro filtro personalizado de excepciones...');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError();
    
    if(rpcError.toString().includes('Empty response') && rpcError.toString().includes('(')) {
      return response.status(500).json({
        status: 500,
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(')-1),
      });
    }
    
    if( typeof rpcError === 'object' &&
       'status' in rpcError &&
        'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : rpcError.status;
      return response.status(status).json(rpcError);
    }

    response.status(400).json({
        status: 400,
        message: rpcError,
    });
  }
}
