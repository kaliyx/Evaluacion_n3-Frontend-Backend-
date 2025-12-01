import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistroDto, LoginDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registro')
  async registro(@Body() registroDto: RegistroDto) {
    return this.authService.registro(
      registroDto.nombre,
      registroDto.email,
      registroDto.password,
      registroDto.telefono,
      registroDto.direccion,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
