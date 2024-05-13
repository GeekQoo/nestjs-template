import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SysRoleService } from "./role.service";
import { LoginGuard } from "@/common/guard/login.guard";
import { PaginationDataDto, ResponseDto } from "@/common/dto/response.dto";
import { SysRoleEntity } from "@/entities/system/sys-role.entity";
import { CreateRoleDto, PaginationSearchRoleDto, UpdateRoleDto } from "@/modules/system/role/role.dto";

@Controller("role")
export class SysRoleController {
    constructor(private readonly sysRoleService: SysRoleService) {}

    /*
     * 新增角色
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: CreateRoleDto): Promise<ResponseDto<string>> {
        await this.sysRoleService.create(dto);
        return ResponseDto.success("新增成功");
    }

    /*
     * 分页查询角色
     */
    @Get()
    @UseGuards(LoginGuard)
    async paginationQuery(
        @Query() dto: PaginationSearchRoleDto
    ): Promise<ResponseDto<PaginationDataDto<SysRoleEntity>>> {
        const [list, total] = await this.sysRoleService.paginationQuery(dto);
        const data = {
            list: list,
            pagination: {
                page: dto.page,
                size: dto.size,
                total
            }
        };
        return ResponseDto.success(data);
    }

    /*
     * 查询所有角色
     */
    @Get("/all")
    @UseGuards(LoginGuard)
    async queryAll() {
        const data = await this.sysRoleService.queryAll();
        return ResponseDto.success(data);
    }

    /*
     * 通过ID查询角色
     */
    @Get(":id")
    @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number): Promise<ResponseDto<SysRoleEntity | string>> {
        const data = await this.sysRoleService.queryById(+id);
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }

    /*
     * 通过ID查询角色绑定菜单
     */
    @Get(":id/menus")
    @UseGuards(LoginGuard)
    async getRoleMenus(@Param("id") id: number): Promise<ResponseDto<number[] | string>> {
        const menus = await this.sysRoleService.getRoleMenus(+id);
        if (menus) {
            return ResponseDto.success(menus);
        } else {
            return ResponseDto.error("未找到该角色绑定的菜单");
        }
    }

    /*
     * 更新角色
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<ResponseDto<string>> {
        const item = await this.sysRoleService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");
        await this.sysRoleService.update(id, updateRoleDto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 删除角色
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number): Promise<ResponseDto<string>> {
        const item = await this.sysRoleService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");

        // 检查角色是否被用户绑定
        const isBound = await this.sysRoleService.isRoleBoundToUser(id);
        if (isBound) return ResponseDto.error("角色已被用户绑定，无法删除");

        await this.sysRoleService.remove(id);
        return ResponseDto.success("删除成功");
    }
}
