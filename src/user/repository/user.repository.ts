import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entity/user.entity';

export abstract class IUserRepository {
  abstract create(user: CreateUserDto): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
