import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDTO, UserDTO, UserToProjectDTO } from '../dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Post('register')
    public async registerUser(  @Body() body: UserDTO) {
        return await this.service.createUser(body)
    }
    @Get()
    public async getUser() {
        return await this.service.findUsers()
    }
    @Get(":id")
    public async getUserbyId(@Param('id') id: string) {
        return await this.service.findUsersById(id)
    }

    @Post('addProject')
    public async addProject(@Body() body: UserToProjectDTO) {
        return await this.service.realtionProject(body)
    }

    @Put(":id")
    public async UpdateUser(@Body() body: UpdateUserDTO, @Param('id') id: string,) {
        return await this.service.updateUser(body, id)
    }

    @Delete(":id")
    public async DeletUser(@Param("id") id: string) {
        return await this.service.deleteUser(id)
    }
}
