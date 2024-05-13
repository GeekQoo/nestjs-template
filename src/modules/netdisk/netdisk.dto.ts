import { IsString } from "class-validator";

// 上传文件
export class uploadFileDto {
    @IsString()
    type: string;
}
