import { Injectable, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SettingsGlobalEntity } from "@/entities/settings/settings-global.entity";
import { SettingsGlobalDto } from "./settings-global.dto";
import { LoginGuard } from "@/common/guard/login.guard";

@Injectable()
export class SettingsGlobalService {
    constructor(
        @InjectRepository(SettingsGlobalEntity)
        private settingsGlobalRepository: Repository<SettingsGlobalEntity>
    ) {}

    /*
     * 保存全局设置
     */
    @UseGuards(LoginGuard)
    async save(params: SettingsGlobalDto): Promise<SettingsGlobalEntity> {
        const item = await this.settingsGlobalRepository.findOne({ where: { id: 1 } });
        const settingsParams = item
            ? this.settingsGlobalRepository.merge(item, params)
            : this.settingsGlobalRepository.create({ ...params });

        return this.settingsGlobalRepository.save(settingsParams);
    }

    /*
     * 查询全局设置
     */
    async query() {
        return this.settingsGlobalRepository.findOne({ where: { id: 1 } });
    }
}
