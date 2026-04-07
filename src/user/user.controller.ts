import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../auth/common/public.decorator';

@ApiTags('User')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({ type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnprocessableEntityResponse({ description: 'User already exists' })
  async createUser(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return await this.userService.create(user);
  }
}
