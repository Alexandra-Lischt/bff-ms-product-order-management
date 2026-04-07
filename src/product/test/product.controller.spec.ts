import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { ProductResponseDto } from '../dto/product-response.dto';
import { Product } from '../entity/product.entity';
import { AuthGuard } from '../../auth/auth.guard';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  const mockProduct: ProductResponseDto = {
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
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      mockProductService.findAll.mockResolvedValue([mockProduct]);

      const result = await controller.findAll();

      expect(result).toEqual([mockProduct]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      mockProductService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a product and return ProductResponseDto', async () => {
      const productInput = {
        name: 'Keyboard',
        category: 'Peripherals',
        description: 'Keyboard Logitech',
        price: 39.8,
        stockQuantity: 5,
      } as Product;

      mockProductService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(productInput);

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(productInput);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productInput = { name: 'Updated Keyboard' } as Product;
      mockProductService.update.mockResolvedValue(undefined);

      await controller.update('product-uuid', productInput);

      expect(service.update).toHaveBeenCalledWith('product-uuid', productInput);
    });

    it('should propagate NotFoundException from service', async () => {
      const productInput = { name: 'Updated Keyboard' } as Product;
      mockProductService.update.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(
        controller.update('invalid-id', productInput),
      ).rejects.toThrow('Product not found');
    });
  });

  describe('delete', () => {
    it('should delete a product', async () => {
      mockProductService.delete.mockResolvedValue(undefined);

      await controller.delete('product-uuid');

      expect(service.delete).toHaveBeenCalledWith('product-uuid');
    });

    it('should propagate errors from service', async () => {
      mockProductService.delete.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(controller.delete('invalid-id')).rejects.toThrow(
        'Product not found',
      );
    });
  });
});
