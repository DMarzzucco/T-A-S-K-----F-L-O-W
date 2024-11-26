import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { DTOAuth } from '../dto/auth.dto';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UsersEntity } from '../../users/entities/users.entity';
import { JwtAuthGuard, JwtRefreshAuthGuard } from '../guards';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }


    @ApiTags('Login')
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
    // Profile
    @ApiTags("Profile")
    @Get("profile")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    public async GetProfile(@Req() req: Request) {
        return await this.service.profile(req);
    }
    // Log out
    @ApiTags("Log Out")
    @Post("logout")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    public async LogOut(@Req() req: Request, @Res() res: Response) {
        const userId = req.idUser;
        return await this.service.LogOut(userId, res)
    }

    // RefreshToken
    @ApiTags("RefreshToken")
    @UseGuards(JwtRefreshAuthGuard)
    @ApiBody({ type: DTOAuth })
    @Post("refresh")
    public async RefreshToken(
        @CurrentUser() body: UsersEntity,
        @Res({ passthrough: true }) res: Response) {

        return await this.service.generateNewAccessToken( body, res);
    }
}
