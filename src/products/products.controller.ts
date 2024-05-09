import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

/**
 * This will consume the products microservice
 */
@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy) {}

  @Post()
  createProduct() {
      return 'createProduct';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find-all-products' },
      paginationDto,
    );
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'find-one-product' },{id},)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
    
    /*try {
      const product = await firstValueFrom(this.productsClient.send(
                      { cmd: 'find-one-product' },
                      {id},
                    ));
      return product;
    } catch(error) {
      throw new RpcException(error);
    }*/
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return 'deleteProduct';
  }

  @Patch(':id')
  updateProduct(
      @Param('id') id: string,
      @Body() body: any
  ) {
    return 'updateProduct (WIP)';
  }

}
