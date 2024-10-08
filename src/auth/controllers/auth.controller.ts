import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { DTOAuth } from '../dto/auth.dto';

@ApiTags('AuthPoint')
@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }

    @ApiBody({ type: DTOAuth })
    @ApiOperation({ summary: "Log a User - ROLE: PUBLIC_ACCESS" })
    @ApiResponse({ status: 200, description: "Date of user" })
    @ApiResponse({ status: 404, description: "Incorrect username/email or non-existent username." })
    @ApiResponse({ status: 401, description: "Date not valid" })
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
