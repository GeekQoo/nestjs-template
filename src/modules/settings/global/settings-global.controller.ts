import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SettingsGlobalService } from "./settings-global.service";
import { PaginationDataDto, ResponseDto } from "@/common/dto/response.dto";
import { PaginationSearchSettingsGlobalDto, SettingsGlobalDto } from "@/modules/settings/global/settings-global.dto";
import { LoginGuard } from "@/common/guard/login.guard";
import { SettingsGlobalEntity } from "@/entities/settings/settings-global.entity";

@Controller("global")
export class SettingsGlobalController {
    constructor(private readonly settingsGlobalService: SettingsGlobalService) {}

    /*
     * 新增全局配置项
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: SettingsGlobalDto) {
        const item = await this.settingsGlobalService.queryByCondition({ key: dto.key });
        if (item) return ResponseDto.error("该配置项已存在");
        await this.settingsGlobalService.create(dto);
        return ResponseDto.success("新增成功");
    }

    /*
     * 删除全局配置项
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number) {
        const item = await this.settingsGlobalService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");

        await this.settingsGlobalService.remove(id);
        return ResponseDto.success("删除成功");
    }

    /*
     * 更新全局配置项
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() dto: SettingsGlobalDto) {
        const item = await this.settingsGlobalService.queryByCondition({ key: dto.key });
        if (item) return ResponseDto.error("该配置项已存在");
        await this.settingsGlobalService.update(id, dto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 分页查询全局配置项
     */
    @Get()
    @UseGuards(LoginGuard)
    async paginationQuery(
        @Query() dto: PaginationSearchSettingsGlobalDto
    ): Promise<ResponseDto<PaginationDataDto<SettingsGlobalEntity>>> {
        const [list, total] = await this.settingsGlobalService.paginationQuery(dto);

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
     * 查询全部全局配置项
     */
    @Get("/all")
    // @UseGuards(LoginGuard)
    async queryAll() {
        const data = await this.settingsGlobalService.queryAll();
        return ResponseDto.success(data);
    }

    /*
     * 通过ID查询全局配置项
     */
    @Get(":id")
    @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number) {
        const data = await this.settingsGlobalService.queryById(id);
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }
}
