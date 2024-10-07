import { IsNotEmpty, IsString } from "class-validator";
import { AuthBody } from "../interfaces/auth.interfaces";
import { ApiProperty } from "@nestjs/swagger";

export class DTOAuth implements AuthBody {
    @ApiProperty({ name: 'username', example: "oskStrzz" })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ name: "password", example: "apple4928" })
    @IsNotEmpty()
    @IsString()
    password: string;
}