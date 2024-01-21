import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken'

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
    super({
      ignoreExpiration: false,
      secretOrKey: 'secretStringThatNoOneCanGuess',
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
    });
  }

  async validate(payload: any, req: Request) {
    try {
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invalid payload or missing email.');
      }
  
      const user = await this.repo.findOneBy({ email: payload.email });
  
      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
  
      req.user = user;
      console.log('User set in req.user:', req.user);
  
      return req.user;
    } catch (error) {
      console.error('Error validating token:', error.message);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  generateResetToken(email: string): string {
    return sign({ email },process.env.JWT_SECRET, { expiresIn: '1h' });
  }
  verifyResetToken(token: string): { email: string } {
    try {
      console.log('Verifying token:', token);
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { email: string };
      console.log('Decoded token:', decodedToken);
      return decodedToken;
    } catch (error) {
      // Handle token verification failure (e.g., expired or invalid token)
      console.error('Error verifying token:', error);
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}