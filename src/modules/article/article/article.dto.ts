import { IsNumber, IsOptional, IsString } from "class-validator";
import { ArticleCategoryDto } from "../category/article-category.dto";
import { ArticleTagDto } from "../tag/article-tag.dto";
import { PaginationParamDto } from "@/common/dto/pagination.dto";

export class ArticleDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsNumber()
    categoryId: ArticleCategoryDto["id"];

    @IsOptional()
    tags?: ArticleTagDto["id"][];
}

// 分页查询文章标签
export class PaginationSearchArticleDto extends PaginationParamDto {}
