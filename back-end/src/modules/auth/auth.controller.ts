import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '@/modules/users/users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { LocalAuthGuard } from '@/modules/auth/passport/local-auth.guard';
import { JwtAuthGuard } from '@/modules/auth/passport/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  // login(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.signIn(createAuthDto.email, createAuthDto.password);
  // }
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
