import { Test, TestingModule } from '@nestjs/testing';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { IUserRepository } from '../../user/repository/user.repository';
import { User } from '../../user/entity/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: IUserRepository;
  let jwtService: JwtService;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockUser: User = {
    id: 'user-uuid',
    name: 'John',
    email: 'admin@email.com',
    password: 'hashed-password',
    createdAt: new Date('2024-01-01'),
    orders: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: IUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<IUserRepository>(IUserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto = { email: 'admin@email.com', password: '123456' };

    it('should return an access token on valid credentials', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token-here');

      const result = await service.login(loginDto);

      expect(result).toEqual({ access_token: 'jwt-token-here' });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'admin@email.com',
      );
      expect(bcrypt.compare).toHaveBeenCalledWith('123456', 'hashed-password');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'user-uuid',
        email: 'admin@email.com',
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      mockUserRepository.findByEmail.mockRejectedValue(new Error('DB error'));

      await expect(service.login(loginDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
