import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from '../users/services/users.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Global()
@Module({
  imports: [UsersModule, PassportModule, JwtModule.registerAsync({
    useFactory: () => {
      return {
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: "10d" }
      }
    }
  })],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
