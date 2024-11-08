import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDTO, UserDTO, UserToProjectDTO } from '../dto/user.dto';
import { UsersService } from '../services/users.service';
import { PublicAcces, Roles, AdminAccess } from '../../auth/decorators';
import {  RolesGuard, JwtAuthGuard } from '../../auth/guards';

@Controller('users')
@UseGuards( JwtAuthGuard, RolesGuard)
export class UsersController {

    constructor(private readonly service: UsersService) { }

    // Register
    @PublicAcces()
    @ApiTags("Register")
    @ApiOperation({ summary: "Register a User - ROLE: PUBLIC_ACCESS " })
    @ApiBody({ type: UserDTO })
    @ApiResponse({ status: 201, description: 'Task Created' })
    @ApiResponse({ status: 409, description: "User already exist" })
    @Post('register')
    public async registerUser(@Body() body: UserDTO) {
        return await this.service.createUser(body)
    }

    // Give a Access Level 
    @Roles("CREATOR")
    @ApiTags('Access Level')
    @ApiBearerAuth()
    @ApiBody({ type: UserToProjectDTO })
    @ApiOperation({ summary: "Give a access level - ROLE: >= CREATOR " })
    @ApiResponse({ status: 200, description: "Operation Successfully" })
    @ApiResponse({ status: 400, description: "Bad Request" })
    @Post('addProject')
    public async addProject(@Body() body: UserToProjectDTO) {
        return await this.service.realtionProject(body)
    }

    // Get All Users
    @Roles('CREATOR')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get all Users - ROLE: >= CREATOR " })
    @ApiResponse({ status: 200, description: "Array of users" })
    @ApiResponse({ status: 400, description: "No data record" })
    @ApiTags('UserPoint')
    @Get()
    public async getUser() {
        return await this.service.findUsers()
    }

    // Get a user by id
    @PublicAcces()
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get a User by id - ROLE: PUBLIC_ACCESS " })
    @ApiResponse({ status: 200, description: "Return the User" })
    @ApiResponse({ status: 404, description: "User not found" })
    @ApiTags('UserPoint')
    @Get(":UserId")
    public async getUserbyId(@Param('UserId') UserId: string) {
        return await this.service.findUsersById(UserId)
    }

    // Update
    @AdminAccess()
    @ApiTags('UserPoint')
    @ApiBearerAuth()
    @ApiBody({ type: UpdateUserDTO })
    @ApiOperation({ summary: "Update a user - ROLE: ADMIN " })
    @ApiResponse({ status: 200, description: "User updated" })
    @ApiResponse({ status: 404, description: "User not found" })
    @Put(":UserId")
    public async UpdateUser(@Body() body: UpdateUserDTO, @Param('UserId') UserId: string,) {
        return await this.service.updateUser(body, UserId)
    }

    // Delete a user
    @AdminAccess()
    @ApiTags('UserPoint')
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete a user - ROLE: ADMIN " })
    @ApiResponse({ status: 200, description: "User deleted" })
    @ApiResponse({ status: 404, description: "User not found" })
    @Delete(":UserId")
    public async DeletUser(@Param("UserId") UserId: string) {
        return await this.service.deleteUser(UserId)
    }
}
