import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token on valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'admin@email.com',
        password: '123456',
      };

      const expectedResponse = { access_token: 'jwt-token-here' };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(service.login).toHaveBeenCalledTimes(1);
    });

    it('should propagate UnauthorizedException from service', async () => {
      const loginDto: LoginDto = {
        email: 'admin@email.com',
        password: 'wrong-password',
      };

      mockAuthService.login.mockRejectedValue(
        new Error('Invalid credentials.'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials.',
      );
    });
  });
});
