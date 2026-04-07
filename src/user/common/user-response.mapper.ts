import { User } from '../entity/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    const response = new UserResponseDto();
    response.id = user.id;
    response.email = user.email;
    response.name = user.name;
    response.createdAt = user.createdAt;

    return response;
  }

  static toResponseData(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
