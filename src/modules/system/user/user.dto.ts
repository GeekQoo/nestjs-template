import { PaginationParamDto } from "@/common/dto/pagination.dto";
import { IsArray, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateIf } from "class-validator";
import { isEmpty } from "lodash";

// 新增用户
export class CreateUserDto {
    @IsString()
    @Matches(/^[a-z0-9A-Z]+$/)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(6, { message: "密码长度不能小于6位" })
    @Matches(/^[^\s]*$/, { message: "密码不能包含空格" })
    password: string;

    @IsString()
    @IsOptional()
    nickname: string;

    @IsEmail()
    @ValidateIf((dto) => !isEmpty(dto.email))
    email: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    remark: string;

    @IsArray()
    roles: number[];

    @IsString()
    @IsOptional()
    avatar: string;
}

// 更新用户
export class UpdateUserDto extends CreateUserDto {
    @IsOptional()
    id: number;

    @IsOptional()
    @ValidateIf((dto) => dto.password && dto.password.trim().length > 0)
    @MinLength(6, { message: "密码长度不能小于6位" })
    @Matches(/^[^\s]*$/, { message: "密码不能包含空格" })
    password: string;
}

// 分页查询用户
export class PaginationSearchUserDto extends PaginationParamDto {
    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsArray()
    @IsOptional()
    roles: number[];
}
