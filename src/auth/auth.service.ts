import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from '../user/repository/user.repository';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private readonly userRepository: IUserRepository,
  ) {}

  async login(login: LoginDto) {
    try {
      const user = await this.userRepository.findByEmail(login.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const isPasswordValid = await bcrypt.compare(
        login.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const payload = { sub: user.id, email: user.email };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      this.logger.error('Error on login.', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error on login.');
    }
  }
}
