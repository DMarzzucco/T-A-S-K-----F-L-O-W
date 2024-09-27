import { IsNotEmpty, IsString } from "class-validator";
import { AuthBody } from "../interfaces/auth.interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class DTOAuth implements AuthBody {
    @ApiProperty({ name: 'username or email', example: "oskStrzz // ozk@gamil.com" })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ name: "User password", example: "apple4928" })
    @IsNotEmpty()
    @IsString()
    password: string;
}