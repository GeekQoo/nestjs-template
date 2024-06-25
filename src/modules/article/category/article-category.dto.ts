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

// 分页查询文章分类
export class PaginationSearchArticleCategoryDto extends PaginationParamDto {}
