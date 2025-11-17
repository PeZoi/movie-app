import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/changePassword-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    const userId = req.user.id;
  }

  @Get()
  findAll(@Query() query: string, @Query('current') current: number, @Query('pageSize') pageSize: number) {
    return this.usersService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
