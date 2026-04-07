import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { User } from '../entity/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return UserResponseDto', async () => {
      const userInput = {
        name: 'John',
        email: 'john@email.com',
        password: '123456',
      } as User;

      const expectedResponse: UserResponseDto = {
        id: 'uuid-123',
        name: 'John',
        email: 'john@email.com',
        createdAt: new Date('2024-01-01'),
      };

      mockUserService.create.mockResolvedValue(expectedResponse);

      const result = await controller.createUser(userInput);

      expect(result).toEqual(expectedResponse);
      expect(service.create).toHaveBeenCalledWith(userInput);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from the service', async () => {
      const userInput = {
        name: 'John',
        email: 'john@email.com',
        password: '123456',
      } as User;

      mockUserService.create.mockRejectedValue(
        new Error('User already exists.'),
      );

      await expect(controller.createUser(userInput)).rejects.toThrow(
        'User already exists.',
      );
    });
  });
});
