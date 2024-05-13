import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SysUserService } from "./user.service";
import { CreateUserDto, PaginationSearchUserDto, UpdateUserDto } from "./user.dto";
import { PaginationDataDto, ResponseDto } from "@/common/dto/response.dto";
import { SysUserEntity } from "@/entities/system/sys-user.entity";
import { LoginGuard } from "@/common/guard/login.guard";
import { SysRoleService } from "@/modules/system/role/role.service";

@Controller("user")
export class SysUserController {
    constructor(
        private readonly sysUserService: SysUserService,
        private readonly sysRoleService: SysRoleService
    ) {}

    /*
     * 新增用户
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: CreateUserDto): Promise<ResponseDto<string>> {
        // 判断用户名是否存在
        const user = await this.sysUserService.queryOneByCondition({ username: dto.username });
        if (user) return ResponseDto.error("该用户名已存在");

        // 判断角色是否存在
        const roleIdList = ((await this.sysRoleService.queryAll()) ?? []).map((item) => item.id);
        const isExistRole = dto.roles.every((i) => roleIdList.includes(i));
        if (!isExistRole) return ResponseDto.error("角色不存在");

        await this.sysUserService.create(dto);
        return ResponseDto.success("新增成功");
    }

    /*
     * 分页查询用户
     */
    @Get()
    @UseGuards(LoginGuard)
    async paginationQuery(
        @Query() dto: PaginationSearchUserDto
    ): Promise<ResponseDto<PaginationDataDto<SysUserEntity>>> {
        const [list, total] = await this.sysUserService.paginationQuery(dto);
        const filterList: SysUserEntity[] = list.map((item) => {
            return {
                ...item,
                password: null
            };
        });
        const data = {
            list: filterList,
            pagination: {
                page: dto.page,
                size: dto.size,
                total
            }
        };
        return ResponseDto.success(data);
    }

    /*
     * 通过ID查询用户
     */
    @Get(":id")
    @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number): Promise<ResponseDto<SysUserEntity | string>> {
        const data = await this.sysUserService.queryOneByCondition({ id: +id });
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }

    /*
     * 更新用户
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto): Promise<ResponseDto<string>> {
        const item = await this.sysUserService.queryOneByCondition({ id: +id });
        if (!item) return ResponseDto.error("未找到该条数据");
        if (updateUserDto.id !== id) return ResponseDto.error("ID不匹配");
        await this.sysUserService.update(id, updateUserDto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 删除用户
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number): Promise<ResponseDto<string>> {
        const item = await this.sysUserService.queryOneByCondition({ id: +id });
        if (!item) return ResponseDto.error("未找到该条数据");
        if (item.username === "admin") return ResponseDto.error("admin账号不能删除");
        await this.sysUserService.remove(id);
        return ResponseDto.success("删除成功");
    }
}
