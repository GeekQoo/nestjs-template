import { IsNumber, IsOptional, IsString } from "class-validator";
import { PaginationParamDto } from "@/common/dto/pagination.dto";

export class SettingsGlobalDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsString()
    name: string;

    @IsString()
    key: string;

    @IsString()
    value: string;

    @IsNumber()
    type: number;

    @IsNumber()
    sort: number;
}

// 分页查询文章标签
export class PaginationSearchSettingsGlobalDto extends PaginationParamDto {}
