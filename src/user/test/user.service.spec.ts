import { Test, TestingModule } from '@nestjs/testing';
import {
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { IUserRepository } from '../repository/user.repository';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let repository: IUserRepository;

  const mockRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: IUserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<IUserRepository>(IUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userInput = {
      name: 'John',
      email: 'john@email.com',
      password: '123456',
    } as User;

    const savedUser = {
      id: 'uuid-123',
      name: 'John',
      email: 'john@email.com',
      password: 'hashed-password',
      createdAt: new Date('2024-01-01'),
      orders: [],
    } as User;

    it('should create a user successfully', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockRepository.create.mockResolvedValue(savedUser);

      const result = await service.create(userInput);

      expect(repository.findByEmail).toHaveBeenCalledWith('john@email.com');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'salt');
      expect(repository.create).toHaveBeenCalledWith({
        ...userInput,
        password: 'hashed-password',
      });
      expect(result).toEqual({
        id: 'uuid-123',
        name: 'John',
        email: 'john@email.com',
        createdAt: new Date('2024-01-01'),
      });
    });

    it('should throw UnprocessableEntityException if user already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue(savedUser);

      await expect(service.create(userInput)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(repository.findByEmail).toHaveBeenCalledWith('john@email.com');
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on unexpected error', async () => {
      mockRepository.findByEmail.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(userInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
