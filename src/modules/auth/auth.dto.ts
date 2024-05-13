import { IsString } from "class-validator";

// 登录
export class LoginDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}
