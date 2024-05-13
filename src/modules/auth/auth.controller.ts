import { Body, Controller, Get, Headers, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./auth.dto";
import { ResponseDto } from "@/common/dto/response.dto";
import { SysUserEntity } from "@/entities/system/sys-user.entity";
import { LoginGuard } from "@/common/guard/login.guard";
import { SysUserService } from "@/modules/system/user/user.service";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly sysUserService: SysUserService
    ) {}

    /*
     * 登录
     */
    @Post("login")
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response
    ): Promise<ResponseDto<SysUserEntity | string>> {
        const data = await this.authService.login(dto);
        if (typeof data === "string") {
            return ResponseDto.error(data);
        } else {
            const token = await this.authService.generateToken(data);
            res.setHeader("token", token);
            return ResponseDto.success(data);
        }
    }

    /*
     * 获取登录用户信息
     */
    @Get("currentUser")
    @UseGuards(LoginGuard)
    async getCurrentUser(@Headers("authorization") authorization: string): Promise<ResponseDto<SysUserEntity>> {
        // 查询token中的用户信息
        const token = authorization.split("Bearer ")[1];
        const data: { user: SysUserEntity } = await this.authService.verifyToken(token);

        // 通过token中的用户id查询最新的用户信息
        const userData = await this.sysUserService.queryOneByCondition({ id: data.user.id });
        const menus = await this.sysUserService.getUserRoleMenus(data.user.id);

        return ResponseDto.success({
            ...userData,
            menus: menus
        });
    }
}
