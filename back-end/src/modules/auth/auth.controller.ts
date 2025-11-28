import { Controller, Post, Body, UseGuards, Request, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dto/create-user.dto';
import { LocalAuthGuard } from '@/modules/auth/passport/local-auth.guard';
import { Public } from '@/decorator/customize';
import { ChangePasswordDto } from '@/modules/users/dto/changePassword-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @Public()
  login(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('register')
  @Public()
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('change-password')
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    const email = req.user.email;
    return this.authService.changePassword(email, dto);
  }
}
