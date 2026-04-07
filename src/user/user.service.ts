import {
  Injectable,
  Inject,
  UnprocessableEntityException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { IUserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from './common/user-response.mapper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(IUserRepository)
    private readonly repository: IUserRepository,
  ) {}

  async create(user: CreateUserDto): Promise<UserResponseDto> {
    try {
      const userExists = await this.repository.findByEmail(user.email);

      if (userExists) {
        throw new UnprocessableEntityException('User already exists.');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      const savedUser = await this.repository.create({
        ...user,
        password: hashedPassword,
      });

      return UserMapper.toResponse(savedUser);
    } catch (error) {
      this.logger.error('Error on create user.', error);
      if (error instanceof UnprocessableEntityException) {
        throw error;
      }
      console.log(error);
      throw new BadRequestException('Error on create user.');
    }
  }
}
