/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { IUserRepository } from './user.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.ormRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name'],
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    const createdUser = this.ormRepository.create(user);
    return await this.ormRepository.save(createdUser);
  }
}
