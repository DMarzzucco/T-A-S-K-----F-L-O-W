import { Body, Controller, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { DTOAuth } from '../dto/auth.dto';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UsersEntity } from 'src/users/entities/users.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }


    @ApiTags('Auth Login')
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: DTOAuth })
    @ApiOperation({ summary: "Log a User - ROLE: PUBLIC_ACCESS" })
    @ApiResponse({ status: 200, description: "Date of user" })
    @ApiResponse({ status: 401, description: "Your are not authorize" })
    @Post('login')

    public async login(
        @CurrentUser() body: UsersEntity,
        @Res({ passthrough: true }) res: Response
    ) {
        return await this.service.generateToken(body, res)
    }


}
