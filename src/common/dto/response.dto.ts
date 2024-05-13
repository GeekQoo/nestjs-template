import { PaginationDto } from "@/common/dto/pagination.dto";

// 全局请求响应数据结构
export class ResponseDto<T> {
    readonly data: T;
    readonly code: number;
    readonly msg: string;

    constructor(code: number, data: T, msg: string) {
        this.code = code;
        this.data = data;
        this.msg = msg;
    }

    static success<T>(data: T) {
        return new ResponseDto(0, data, "success");
    }

    static error(msg: string, code: number = -1) {
        return new ResponseDto(code, null, msg);
    }
}

// 分页响应数据结构
export class PaginationDataDto<T> {
    list: T[];
    pagination: PaginationDto;
}
