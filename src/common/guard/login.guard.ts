import { JwtService } from "@nestjs/jwt";
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(@Inject(JwtService) private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest();
        const authorization = request.header("authorization");
        if (!authorization || !authorization.includes("Bearer ")) {
            throw new UnauthorizedException("token不正确，请重新登录");
        }
        const token = authorization.split("Bearer ")[1];
        try {
            await this.jwtService.verify(token);
            return true;
        } catch (error) {
            throw new UnauthorizedException("登录token失效，请重新登录");
        }
    }
}
