import { PaginationParamDto } from "@/common/dto/pagination.dto";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

// 新增角色
export class CreateRoleDto {
    @IsString()
    @IsOptional()
    roleName: string;

    @IsString()
    @IsOptional()
    remark: string;

    @IsArray()
    @IsOptional()
    menus: number[];
}

// 更新角色
export class UpdateRoleDto extends CreateRoleDto {
    @IsOptional()
    @IsNumber()
    id: number;
}

// 分页查询角色
export class PaginationSearchRoleDto extends PaginationParamDto {
    @IsString()
    @IsOptional()
    roleName: string;
}
