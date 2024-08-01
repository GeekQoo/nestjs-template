import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SettingsBannerService } from "./settings-banner.service";
import { PaginationSearchSettingsBannerDto, SettingsBannerDto } from "./settings-banner.dto";
import { PaginationDataDto, ResponseDto } from "@/common/dto/response.dto";
import { LoginGuard } from "@/common/guard/login.guard";
import { SettingsBannerEntity } from "@/entities/settings/settings-banner.entity";

@Controller("banner")
export class SettingsBannerController {
    constructor(private readonly settingsBannerService: SettingsBannerService) {}

    /*
     * 新增幻灯片
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: SettingsBannerDto) {
        await this.settingsBannerService.create(dto);
        return ResponseDto.success("新增成功");
    }

    /*
     * 删除幻灯片
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number) {
        const item = await this.settingsBannerService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");

        await this.settingsBannerService.remove(id);
        return ResponseDto.success("删除成功");
    }

    /*
     * 更新幻灯片
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() dto: SettingsBannerDto) {
        await this.settingsBannerService.update(id, dto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 分页查询幻灯片
     */
    @Get()
    @UseGuards(LoginGuard)
    async paginationQuery(
        @Query() dto: PaginationSearchSettingsBannerDto
    ): Promise<ResponseDto<PaginationDataDto<SettingsBannerEntity>>> {
        const [list, total] = await this.settingsBannerService.paginationQuery(dto);

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
     * 查询全部幻灯片
     */
    @Get("/all")
    @UseGuards(LoginGuard)
    async queryAll() {
        const data = await this.settingsBannerService.queryAll();
        return ResponseDto.success(data);
    }

    /*
     * 通过ID查询幻灯片
     */
    @Get(":id")
    @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number) {
        const data = await this.settingsBannerService.queryById(id);
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }
}
