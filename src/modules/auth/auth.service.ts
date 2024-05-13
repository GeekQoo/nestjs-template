import { Injectable } from "@nestjs/common";
import { SysUserEntity } from "@/entities/system/sys-user.entity";
import { LoginDto } from "./auth.dto";
import { JwtService } from "@nestjs/jwt";
import { BcryptUtil } from "@/utils/bcrypt";
import { SysUserService } from "@/modules/system/user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly sysUserService: SysUserService,
        private jwtService: JwtService
    ) {}

    /*
     * 生成token并存储用户信息
     */
    async generateToken(user: SysUserEntity): Promise<string> {
        const currentUser = await this.sysUserService.queryOneByCondition({ id: user.id });
        const menus = await this.sysUserService.getUserRoleMenus(user.id);
        return await this.jwtService.signAsync({
            user: { ...currentUser, menus: menus }
        });
    }

    /*
     * 验证token并返回用户信息
     */
    async verifyToken(token: string): Promise<{ user: SysUserEntity }> {
        return await this.jwtService.verifyAsync(token);
    }

    /*
     * 登录
     */
    async login(params: LoginDto) {
        const currentUser = await this.sysUserService.queryOneByCondition({ username: params.username }, true);
        if (!currentUser) return "用户名不存在";
        const passwordMatch = await BcryptUtil.comparePassword(params.password, currentUser.password);
        if (!passwordMatch) return "密码错误";
        return {
            ...currentUser,
            password: null
        };
    }
}
