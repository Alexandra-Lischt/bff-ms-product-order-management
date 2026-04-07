import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from '../product.service';
import { IProductRepository } from '../repository/product.repository';
import { Product } from '../entity/product.entity';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: IProductRepository;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockProduct: Product = {
    id: 'product-uuid',
    name: 'Keyboard',
    category: 'Peripherals',
    description: 'Keyboard Logitech',
    price: 39.8,
    stockQuantity: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: IProductRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<IProductRepository>(IProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockRepository.findAll.mockResolvedValue([mockProduct]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('product-uuid');
      expect(result[0].name).toBe('Keyboard');
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const input = {
        name: 'Keyboard',
        category: 'Peripherals',
        description: 'Keyboard Logitech',
        price: 39.8,
        stockQuantity: 5,
      } as Product;

      mockRepository.create.mockResolvedValue(mockProduct);

      const result = await service.create(input);

      expect(result.id).toBe('product-uuid');
      expect(result.name).toBe('Keyboard');
      expect(repository.create).toHaveBeenCalledWith(input);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create({} as Product)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.update.mockResolvedValue(undefined);

      await service.update('product-uuid', {
        name: 'Updated',
      } as UpdateProductDto);

      expect(repository.findById).toHaveBeenCalledWith('product-uuid');
      expect(repository.update).toHaveBeenCalledWith('product-uuid', {
        name: 'Updated',
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update('invalid-id', {} as Product)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      mockRepository.findById.mockRejectedValue(new Error('DB error'));

      await expect(
        service.update('product-uuid', {} as Product),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      mockRepository.findById.mockResolvedValue(mockProduct);
      mockRepository.delete.mockResolvedValue(undefined);

      await service.delete('product-uuid');

      expect(repository.findById).toHaveBeenCalledWith('product-uuid');
      expect(repository.delete).toHaveBeenCalledWith('product-uuid');
    });

    it('should throw NotFoundException when product does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      mockRepository.findById.mockRejectedValue(new Error('DB error'));

      await expect(service.delete('product-uuid')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
