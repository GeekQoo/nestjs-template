import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { SysMenuService } from "./menu.service";
import { LoginGuard } from "@/common/guard/login.guard";
import { CreateMenuDto, UpdateMenuDto } from "@/modules/system/menu/menu.dto";
import { ResponseDto } from "@/common/dto/response.dto";
import { SysMenuEntity } from "@/entities/system/sys-menu.entity";

@Controller("menu")
export class SysMenuController {
    constructor(private readonly sysMenuService: SysMenuService) {}

    /*
     * 新增菜单
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: CreateMenuDto) {
        const data = await this.sysMenuService.create(dto);
        if (dto.parentId) {
            const parent = await this.sysMenuService.queryById(dto.parentId);
            if (!parent) return ResponseDto.error("父菜单不存在");
        }
        return ResponseDto.success(data);
    }

    /*
     * 编辑菜单
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() dto: UpdateMenuDto): Promise<ResponseDto<string>> {
        const item = await this.sysMenuService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");
        await this.sysMenuService.update(id, dto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 查询全部菜单
     */
    @Get()
    @UseGuards(LoginGuard)
    async queryAll() {
        const data = await this.sysMenuService.queryAll();
        return ResponseDto.success(data);
    }

    /*
     * 通过ID查询菜单
     */
    @Get(":id")
    @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number): Promise<ResponseDto<SysMenuEntity | string>> {
        const data = await this.sysMenuService.queryById(+id);
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }

    /*
     * 删除菜单
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number): Promise<ResponseDto<string>> {
        const item = await this.sysMenuService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");

        // 检查菜单是否被角色绑定
        const isBound = await this.sysMenuService.isMenuBoundToRole(id);
        if (isBound) return ResponseDto.error("菜单已被角色绑定，无法删除");

        // 检查是否存在parentId为要删除的id的子菜单
        const childMenus = await this.sysMenuService.findByParentId(id);
        if (childMenus.length > 0) return ResponseDto.error("存在子菜单，无法删除");

        await this.sysMenuService.remove(id);
        return ResponseDto.success("删除成功");
    }
}
