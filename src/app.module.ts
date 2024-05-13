import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SystemModule } from "@/modules/system/system.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "@/modules/auth/auth.module";
import { NetdiskModule } from "@/modules/netdisk/netdisk.module";

@Module({
    imports: [
        // 数据库模块
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "database",
            password: "database",
            database: "database",
            // entities: [],
            synchronize: true,
            retryDelay: 500,
            retryAttempts: 10,
            autoLoadEntities: true
        }),
        // jwt模块
        JwtModule.register({
            global: true,
            secret: "nestjsTemplateSecret",
            signOptions: {
                expiresIn: "7d"
            }
        }),
        // 认证模块
        AuthModule,
        // 系统模块
        SystemModule,
        // 网盘模块
        NetdiskModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
