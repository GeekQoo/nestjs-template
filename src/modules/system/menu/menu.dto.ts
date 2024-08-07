import { PaginationParamDto } from "@/common/dto/pagination.dto";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

// 新增菜单
export class CreateMenuDto {
    @IsOptional()
    @IsNumber()
    parentId: number;

    @IsString()
    menuName: string;

    @IsNumber()
    type: number;

    @IsOptional()
    @IsString()
    icon: string;

    @IsOptional()
    @IsString()
    router: string;

    @IsOptional()
    @IsBoolean()
    isShow: boolean;

    @IsOptional()
    @IsNumber()
    sort: number;
}

// 更新菜单
export class UpdateMenuDto extends CreateMenuDto {
    @IsOptional()
    @IsNumber()
    id: number;
}

// 分页查询菜单
export class PaginationSearchMenuDto extends PaginationParamDto {
    @IsString()
    @IsOptional()
    menuName: string;
}
