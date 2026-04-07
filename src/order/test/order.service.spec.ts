import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { OrderService } from '../order.service';
import { IOrderRepository } from '../repository/order.repository';
import { Order } from '../entity/order.entity';
import { User } from '../../user/entity/user.entity';
import { Product } from '../../product/entity/product.entity';

describe('OrderService', () => {
  let service: OrderService;

  const mockRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  const mockManager = {
    findOne: jest.fn(),
    save: jest.fn(),
    getRepository: jest.fn(),
  } as unknown as EntityManager;

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockUser: User = {
    id: 'user-uuid',
    name: 'John',
    email: 'john@email.com',
    password: 'hashed',
    createdAt: new Date('2024-01-01'),
    orders: [],
  };

  const mockProduct: Product = {
    id: 'product-uuid',
    name: 'Keyboard',
    category: 'Peripherals',
    description: 'Keyboard Logitech',
    price: 39.8,
    stockQuantity: 10,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: IOrderRepository,
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const mockOrder: Order = {
        id: 'order-uuid',
        totalPrice: 79.6,
        status: 'PAID',
        createdAt: new Date('2024-01-01'),
        user: mockUser,
        items: [
          {
            id: 'item-uuid',
            quantity: 2,
            priceAtPurchase: 39.8,
            createdAt: new Date('2024-01-01'),
            order: {} as Order,
            product: mockProduct,
          },
        ],
      };

      mockRepository.findAll.mockResolvedValue([mockOrder]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('order-uuid');
      expect(result[0].totalPrice).toBe(79.6);
      expect(result[0].status).toBe('PAID');
    });

    it('should return empty array when no orders', async () => {
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
    const itemsData = [{ productId: 'product-uuid', quantity: 2 }];

    it('should create an order successfully', async () => {
      const savedOrder: Order = {
        id: 'order-uuid',
        totalPrice: 79.6,
        status: 'PAID',
        createdAt: new Date('2024-01-01'),
        user: mockUser,
        items: [
          {
            id: 'item-uuid',
            quantity: 2,
            priceAtPurchase: 39.8,
            createdAt: new Date('2024-01-01'),
            order: {} as Order,
            product: mockProduct,
          },
        ],
      };

      mockDataSource.transaction.mockImplementation(async (cb: Function) => {
        (mockManager.findOne as jest.Mock)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce({ ...mockProduct, stockQuantity: 10 });
        (mockManager.save as jest.Mock).mockResolvedValue(undefined);
        mockRepository.create.mockResolvedValue(savedOrder);

        return cb(mockManager);
      });

      const result = await service.create('user-uuid', itemsData);

      expect(result.id).toBe('order-uuid');
      expect(result.status).toBe('PAID');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockDataSource.transaction.mockImplementation(async (cb: Function) => {
        (mockManager.findOne as jest.Mock).mockResolvedValue(null);
        return cb(mockManager);
      });

      await expect(service.create('invalid-id', itemsData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      mockDataSource.transaction.mockImplementation(async (cb: Function) => {
        (mockManager.findOne as jest.Mock)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce(null);
        return cb(mockManager);
      });

      await expect(
        service.create('user-uuid', itemsData),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      mockDataSource.transaction.mockImplementation(async (cb: Function) => {
        (mockManager.findOne as jest.Mock)
          .mockResolvedValueOnce(mockUser)
          .mockResolvedValueOnce({ ...mockProduct, stockQuantity: 1 });
        return cb(mockManager);
      });

      await expect(
        service.create('user-uuid', [{ productId: 'product-uuid', quantity: 5 }]),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      mockDataSource.transaction.mockRejectedValue(new Error('DB error'));

      await expect(
        service.create('user-uuid', itemsData),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
