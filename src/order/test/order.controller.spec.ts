import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { OrderResponseDto } from '../dto/order-response.dto';
import { CreateOrderDto } from '../dto/create-order.dto';
import { AuthGuard } from '../../auth/auth.guard';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  const mockAuthGuard = { canActivate: jest.fn(() => true) };

  const mockOrderResponse: OrderResponseDto = {
    id: 'order-uuid',
    totalPrice: 79.6,
    status: 'PAID',
    products: [],
    createdAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      mockOrderService.findAll.mockResolvedValue([mockOrderResponse]);

      const result = await controller.findAll();

      expect(result).toEqual([mockOrderResponse]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no orders exist', async () => {
      mockOrderService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create an order and return OrderResponseDto', async () => {
      const orderInput: CreateOrderDto = {
        items: [{ productId: 'product-uuid', quantity: 2 }],
      };

      const req = { user: { sub: 'user-uuid' } };

      mockOrderService.create.mockResolvedValue(mockOrderResponse);

      const result = await controller.create(orderInput, req);

      expect(result).toEqual(mockOrderResponse);
      expect(service.create).toHaveBeenCalledWith('user-uuid', orderInput.items);
    });

    it('should propagate errors from the service', async () => {
      const orderInput: CreateOrderDto = {
        items: [{ productId: 'product-uuid', quantity: 2 }],
      };

      const req = { user: { sub: 'user-uuid' } };

      mockOrderService.create.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(controller.create(orderInput, req)).rejects.toThrow(
        'Product not found',
      );
    });
  });
});
