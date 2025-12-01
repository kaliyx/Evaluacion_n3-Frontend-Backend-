import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const rawAuth = req.headers.authorization;
    const token = rawAuth?.split(' ')[1];

    if (!token) {
      return next();
    }

    try {
      const decoded = this.jwtService.verify(token);
      (req as any).usuario = decoded;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }

    next();
  }
}
