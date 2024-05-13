import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { uploadFileDto } from "@/modules/netdisk/netdisk.dto";

@Injectable()
export class NetdiskService {
    constructor() {}

    // 单文件上传
    uploadFile(file: Express.Multer.File, dto: uploadFileDto, controllerPath: string) {
        // 如果type字段不存在，创建一个同名的新文件夹
        const typePath = path.join(process.cwd(), `uploads/${dto.type}`);
        if (!fs.existsSync(typePath)) fs.mkdirSync(typePath);

        // 将文件移动到指定的文件夹
        const newPath = `${typePath}/${file.filename}`;
        fs.renameSync(file.path, newPath);

        // 返回文件信息
        return {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/${controllerPath}/${dto.type}/${file.filename}`
        };
    }
}
