import { CreateProductDto } from '../dto/create-product.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

export abstract class IProductRepository {
  abstract findAll(): Promise<ProductResponseDto[]>;
  abstract findById(id: string): Promise<ProductResponseDto | null>;
  abstract create(product: CreateProductDto): Promise<ProductResponseDto>;
  abstract update(id: string, product: UpdateProductDto): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
