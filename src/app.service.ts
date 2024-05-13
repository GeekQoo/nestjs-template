import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHome(): string {
        return "欢迎使用nestjs-template";
    }
}
