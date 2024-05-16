import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamDto } from "@/common/dto/pagination.dto";

export class ArticleCategoryDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    categoryName: string;

    @IsOptional()
    @IsNumber()
    parentId?: number;
}

// 分页查询用户
export class PaginationSearchArticleCategoryDto extends PaginationParamDto {}
