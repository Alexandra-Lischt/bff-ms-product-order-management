import { Product } from '../entity/product.entity';
import { ProductResponseDto } from '../dto/product-response.dto';

export class ProductMapper {
  static toResponse(product: Product): ProductResponseDto {
    const response = new ProductResponseDto();
    response.id = product.id;
    response.name = product.name;
    response.category = product.category;
    response.description = product.description;
    response.price = Number(product.price);
    response.stockQuantity = product.stockQuantity;
    response.createdAt = product.createdAt;
    response.updatedAt = product.updatedAt;

    return response;
  }

  static toResponseList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponse(product));
  }
}
