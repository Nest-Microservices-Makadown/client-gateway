import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, lastValueFrom, timeout } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * This will consume the products microservice
 */
@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
      return this.productsClient.send({ cmd: 'create-product' }, createProductDto).pipe(
        catchError((err) => {
          throw new RpcException(err);
        })
      );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find-all-products' },
      paginationDto,
    ).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
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
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'remove-product' }, {id}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Patch(':id')
  updateProduct(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productsClient.send({ cmd: 'update-product' }, {id, ...updateProductDto}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

}
