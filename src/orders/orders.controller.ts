import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe, ParseEnumPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDERS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { OrderPaginationDto, OrderStatus, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Get()
  findAll(@Query() paginationDto: OrderPaginationDto) {
    return this.ordersClient.send(
       'findAllOrders',
      paginationDto,
    ).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder',{id},)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Get(':status')
  findByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
     const orderPaginationDto: OrderPaginationDto = {
      status: statusDto.status,
      ...paginationDto
    };

    return this.ordersClient.send('findAllOrders',orderPaginationDto)
    .pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Patch(':id')
  changeOrderStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() newStatusDto: StatusDto
  ) {    
     return this.ordersClient.send('changeOrderStatus', {id, ...newStatusDto}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }
}
