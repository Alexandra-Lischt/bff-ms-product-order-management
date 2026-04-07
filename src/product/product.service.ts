import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ProductResponseDto } from './dto/product-response.dto';
import { IProductRepository } from './repository/product.repository';
import { ProductMapper } from './common/product-response.mapper';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @Inject(IProductRepository)
    private readonly repository: IProductRepository,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    try {
      const products = await this.repository.findAll();
      return ProductMapper.toResponseList(products);
    } catch (error) {
      this.logger.error('Error on find all products.', error);
      throw new InternalServerErrorException('Error on find all products.');
    }
  }

  async create(product: CreateProductDto): Promise<ProductResponseDto> {
    try {
      const newProduct = await this.repository.create(product);
      return ProductMapper.toResponse(newProduct);
    } catch (error) {
      this.logger.error('Error on create product.', error);
      throw new InternalServerErrorException('Error on create product.');
    }
  }

  async update(id: string, product: UpdateProductDto): Promise<void> {
    try {
      const existingProduct = await this.repository.findById(id);

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found. `);
      }
      await this.repository.update(id, product);
    } catch (error) {
      this.logger.error(`Error on update product with ID ${id}.`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error on update product.`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const existingProduct = await this.repository.findById(id);

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }
      await this.repository.delete(id);
    } catch (error) {
      this.logger.error(`Error on delete product with ID ${id}.`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error on delete product.`);
    }
  }
}
