import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
    HttpException,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Res,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { NetdiskService } from "./netdisk.service";
import { UploadFileDto } from "@/modules/netdisk/netdisk.dto";
import { ResponseDto } from "@/common/dto/response.dto";
import * as multer from "multer";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";

@Controller("netdisk")
export class NetdiskController {
    constructor(private readonly netdiskService: NetdiskService) {}

    /*
     *  获取文件
     */
    @Get(":type/:filename")
    async serveFile(@Param("type") type: string, @Param("filename") filename: string, @Res() res: Response) {
        const filePath = path.join(process.cwd(), `uploads/${type}/${filename}`);
        res.sendFile(filePath);
    }

    /*
     *  单文件上传
     */
    @Post("upload")
    @UseInterceptors(
        FileInterceptor("file", {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    // 如果不存在uploads文件夹就创建一个
                    const uploadDir = path.join(process.cwd(), "uploads");
                    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
                    cb(null, path.join(process.cwd(), "uploads"));
                },
                filename: (req, file, cb) => {
                    // 获取文件后缀名
                    const fileExtension = path.extname(file.originalname);
                    // 生成唯一文件名
                    const uniqueFilename = uuidv4() + fileExtension;
                    cb(null, uniqueFilename);
                }
            })
        })
    )
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                exceptionFactory: () => {
                    throw new HttpException({ message: "上传了不支持的文件或文件过大，请检查后重试" }, 400);
                },
                validators: [
                    // 限制50M
                    new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 50 }),
                    // 限制文件类型
                    new FileTypeValidator({
                        fileType: [
                            // 图片
                            "image/jpeg",
                            "image/png",
                            "image/gif",
                            "image/bmp",
                            "image/svg+xml",
                            "image/webp",
                            // 视频
                            "video/mp4",
                            "video/quicktime",
                            "video/x-msvideo",
                            // 压缩包
                            "application/zip"
                        ].join("|")
                    })
                ]
            })
        )
        file: Express.Multer.File,
        @Body() dto: UploadFileDto
    ) {
        const uploadedFile = this.netdiskService.uploadFile(file, dto, "netdisk");
        return ResponseDto.success(uploadedFile);
    }
}
