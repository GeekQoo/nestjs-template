import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class PaginationParamDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly page: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    readonly size: number;
}

export class PaginationDto extends PaginationParamDto {
    readonly total: number;
}
