import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamDto } from "@/common/dto/pagination.dto";

export class SettingsBannerDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    imageUrl: string;

    @IsString()
    @IsOptional()
    linkUrl?: string;

    @IsNumber()
    sort: number;
}

// 分页查询文章标签
export class PaginationSearchSettingsBannerDto extends PaginationParamDto {}
