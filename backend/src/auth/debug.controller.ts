import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('api/debug')
export class DebugController {
  constructor(private jwtService: JwtService) {}

  @Get('token')
  debugToken(@Req() req: Request) {
    // Only allow in non-production
    if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('Not allowed in production');
    }

    const raw = req.headers.authorization;
    if (!raw) return { ok: false, message: 'No Authorization header' };

    const token = raw.split(' ')[1];
    if (!token) return { ok: false, message: 'Malformed Authorization header' };

    try {
      const decoded = this.jwtService.verify(token);
      return { ok: true, decoded };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Invalid token', stack: err?.stack };
    }
  }
}
