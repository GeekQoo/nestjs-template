import { IsString } from "class-validator";
import { PaginationParamDto } from "@/common/dto/pagination.dto";

export class ArticleTagDto {
    @IsString()
    tagName: string;
}

// 分页查询文章标签
export class PaginationSearchArticleTagDto extends PaginationParamDto {}
