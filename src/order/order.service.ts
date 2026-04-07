import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IOrderRepository } from './repository/order.repository';
import { OrderResponseDto } from './dto/order-response.dto';
import { User } from '../user/entity/user.entity';
import { Product } from '../product/entity/product.entity';
import { OrderItem } from './entity/order-items.entity';
import { Order } from './entity/order.entity';
import { OrderMapper } from './common/order-response.mapper';
import { OrderBuilder, OrderItemBuilder } from './common/builders';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(IOrderRepository)
    private repository: IOrderRepository,
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<OrderResponseDto[]> {
    try {
      const orders: Order[] = await this.repository.findAll();
      return OrderMapper.toResponseList(orders);
    } catch (error) {
      this.logger.error('Error on find all orders.', error);
      throw new InternalServerErrorException('Error on find all orders.');
    }
  }

  async create(
    userId: string,
    itemsData: { productId: string; quantity: number }[],
  ): Promise<OrderResponseDto> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        let totalOrderPrice = 0;
        const orderItems: OrderItem[] = [];

        for (const item of itemsData) {
          const product = await manager.findOne(Product, {
            where: { id: item.productId },
          });
          if (!product)
            throw new NotFoundException(`Product ${item.productId} not found`);

          if (product.stockQuantity < item.quantity) {
            throw new BadRequestException(
              `Insufficient stock for ${product.name}`,
            );
          }

          product.stockQuantity -= item.quantity;
          await manager.save(product);

          const orderItem = new OrderItemBuilder()
            .withProduct(product)
            .withQuantity(item.quantity)
            .withPriceAtPurchase(product.price)
            .build();

          totalOrderPrice += Number(product.price) * item.quantity;
          orderItems.push(orderItem);
        }

        const order = new OrderBuilder()
          .withUser(user)
          .withItems(orderItems)
          .withTotalPrice(totalOrderPrice)
          .withStatus('PAID')
          .build();

        const savedOrder = await this.repository.create(order, manager);
        return OrderMapper.toResponse(savedOrder);
      });
    } catch (error) {
      this.logger.error('Error on create order.', error);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error on create order.');
    }
  }
}
