import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { DTOAuth } from '../dto/auth.dto';
import { Response } from 'express';

@ApiTags('AuthPoint')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @ApiBody({ type: DTOAuth })
    @ApiCookieAuth()
    @ApiOperation({ summary: "Log a User - ROLE: PUBLIC_ACCESS" })
    @ApiResponse({ status: 200, description: "Date of user" })
    @ApiResponse({ status: 401, description: "Your are not authorizate" })
    @Post('login')
    public async login(@Body() { username, password }: DTOAuth, @Res() res: Response) {
        const user = await this.service.validateUser(username, password)
        if (!user) {
            throw new UnauthorizedException('Incorrect username/email or non-existent username.');
        }
        await this.service.generateToken(user, res)
        
    }
}
