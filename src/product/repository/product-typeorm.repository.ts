import { Injectable } from '@nestjs/common';
import { ProductResponseDto } from '../dto/product-response.dto';
import { IProductRepository } from './product.repository';
import { Product } from '../entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly ormRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    return this.ormRepository.find();
  }

  async findById(id: string): Promise<ProductResponseDto | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async create(product: Product): Promise<ProductResponseDto> {
    const createdProduct = this.ormRepository.create(product);
    return this.ormRepository.save(createdProduct);
  }

  async update(id: string, product: UpdateProductDto): Promise<void> {
    await this.ormRepository.update({ id }, product);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
