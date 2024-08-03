import { Body, Controller, Get, Post } from "@nestjs/common";
import { SettingsGlobalService } from "./settings-global.service";
import { ResponseDto } from "@/common/dto/response.dto";
import { SettingsGlobalDto } from "@/modules/settings/global/settings-global.dto";

@Controller("global")
export class SettingsGlobalController {
    constructor(private readonly settingsGlobalService: SettingsGlobalService) {}

    /*
     * 保存全局设置
     */
    @Post()
    async save(@Body() dto: SettingsGlobalDto) {
        await this.settingsGlobalService.save(dto);
        return ResponseDto.success("保存成功");
    }

    /*
     * 查询全局设置
     */
    @Get()
    async query() {
        const settings = await this.settingsGlobalService.query();
        return ResponseDto.success(settings);
    }
}
