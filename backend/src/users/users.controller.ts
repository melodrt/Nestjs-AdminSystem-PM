import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersService.findAll();
    return users.map(({ password, ...user }) => user);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateDto: { name?: string; email?: string },
  ): Promise<Omit<User, 'password'>> {
    const userId = req.user.sub;
    const user = await this.usersService.updateUser(userId, updateDto.name, updateDto.email);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: { currentPassword: string; newPassword: string },
  ): Promise<{ message: string }> {
    const userId = req.user.sub;
    await this.usersService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Contraseña actualizada exitosamente' };
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@Request() req): Promise<{ message: string }> {
    const userId = req.user.sub;
    await this.usersService.deleteUser(userId);
    return { message: 'Perfil eliminado exitosamente' };
  }
}
