import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamDto } from "@/common/dto/pagination.dto";

export class ArticleTagDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    tagName: string;
}

// 分页查询文章标签
export class PaginationSearchArticleTagDto extends PaginationParamDto {}
