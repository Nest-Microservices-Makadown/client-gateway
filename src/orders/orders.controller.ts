import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe, ParseEnumPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, OrderStatus, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('createOrder', createOrderDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }

  @Get()
  findAll(@Query() paginationDto: OrderPaginationDto) {
    return this.natsClient.send(
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
    return this.natsClient.send('findOneOrder',{id},)
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

    return this.natsClient.send('findAllOrders',orderPaginationDto)
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
     return this.natsClient.send('changeOrderStatus', {id, ...newStatusDto}).pipe(
      catchError((err) => {
        throw new RpcException(err);
      })
    );
  }
}
