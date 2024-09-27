import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { DTOAuth } from '../dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('AuthPoint')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @Post('login')
    public async login(@Body() { username, password }: DTOAuth) {
        const user = await this.service.validateUser(username, password)
        if (!user) {
            throw new UnauthorizedException('Data not valid');
        }
        const jwt = await this.service.generateToken(user)
        return jwt
    }
}
