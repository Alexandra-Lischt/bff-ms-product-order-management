import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@email.com' })
  @IsNotEmpty({ message: 'The email should be provided.' })
  @IsEmail({}, { message: 'Provide a valid email.' })
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'The password should be provided.' })
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password!: string;
}
