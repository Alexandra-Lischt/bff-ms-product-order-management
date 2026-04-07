import { ProductMapper } from '../../product/common/product-response.mapper';
import { Order } from '../entity/order.entity';
import { OrderResponseDto } from '../dto/order-response.dto';

export class OrderMapper {
  static toResponse(order: Order): OrderResponseDto {
    const response = new OrderResponseDto();
    response.id = order.id;
    response.totalPrice = Number(order.totalPrice);
    response.status = order.status;
    response.createdAt = order.createdAt;

    response.products = order.items?.map((item) =>
      ProductMapper.toResponse(item.product),
    );

    return response;
  }

  static toResponseList(orders: Order[]): OrderResponseDto[] {
    return orders.map((order) => this.toResponse(order));
  }
}
