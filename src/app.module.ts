import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SystemModule } from "@/modules/system/system.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "@/modules/auth/auth.module";
import { NetdiskModule } from "@/modules/netdisk/netdisk.module";
import { ArticleModule } from "@/modules/article/article.module";
import { SettingsModule } from "@/modules/settings/settings.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env"
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    type: "mysql",
                    host: configService.get<string>("DB_HOST"),
                    port: configService.get<number>("DB_PORT"),
                    username: configService.get<string>("DB_USERNAME"),
                    password: configService.get<string>("DB_PASSWORD"),
                    database: configService.get<string>("DB_DATABASE"),
                    synchronize: true,
                    retryDelay: 500,
                    retryAttempts: 10,
                    autoLoadEntities: true
                };
            },
            inject: [ConfigService]
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
        NetdiskModule,
        // 文章模块
        ArticleModule,
        // 设置模块
        SettingsModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
