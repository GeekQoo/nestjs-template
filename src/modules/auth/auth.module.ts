import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { SysUserEntity } from "@/entities/system/sys-user.entity";
import { SystemModule } from "@/modules/system/system.module";

@Module({
    imports: [TypeOrmModule.forFeature([SysUserEntity]), SystemModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
