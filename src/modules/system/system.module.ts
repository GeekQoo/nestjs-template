import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SysUserService } from "./user/user.service";
import { SysUserController } from "./user/user.controller";
import { SysUserEntity } from "@/entities/system/sys-user.entity";
import { SysRoleService } from "./role/role.service";
import { SysRoleController } from "./role/role.controller";
import { SysRoleEntity } from "@/entities/system/sys-role.entity";
import { SysUserRoleEntity } from "@/entities/system/sys-user-role.entity";
import { SysMenuEntity } from "@/entities/system/sys-menu.entity";
import { SysMenuController } from "@/modules/system/menu/menu.controller";
import { SysMenuService } from "@/modules/system/menu/menu.service";
import SysRoleMenuEntity from "@/entities/system/sys-role-menu.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([SysUserEntity, SysRoleEntity, SysMenuEntity, SysUserRoleEntity, SysRoleMenuEntity]),
        RouterModule.register([
            {
                path: "/system",
                module: SystemModule
            }
        ])
    ],
    controllers: [SysUserController, SysRoleController, SysMenuController],
    providers: [SysUserService, SysRoleService, SysMenuService],
    exports: [SysUserService]
})
export class SystemModule {}
