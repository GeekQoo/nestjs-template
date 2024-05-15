import { IsString } from "class-validator";

// 上传文件
export class UploadFileDto {
    @IsString()
    type: string;
}
