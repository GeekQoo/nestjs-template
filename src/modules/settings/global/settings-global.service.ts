import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SettingsGlobalEntity } from "@/entities/settings/settings-global.entity";
import { PaginationSearchSettingsGlobalDto, SettingsGlobalDto } from "./settings-global.dto";

@Injectable()
export class SettingsGlobalService {
    constructor(
        @InjectRepository(SettingsGlobalEntity)
        private settingsGlobalRepository: Repository<SettingsGlobalEntity>
    ) {}

    /*
     * 新增全局配置项
     */
    async create(params: SettingsGlobalDto) {
        await this.settingsGlobalRepository.save(params);
    }

    /*
     * 删除全局配置项
     */
    async remove(id: number) {
        return await this.settingsGlobalRepository.delete(id);
    }

    /*
     * 更新全局配置项
     */
    async update(id: number, params: SettingsGlobalDto) {
        await this.settingsGlobalRepository.update(id, params);
    }

    /*
     * 分页查询全局配置项
     */
    async paginationQuery(params: PaginationSearchSettingsGlobalDto) {
        const { page, size } = params;
        return await this.settingsGlobalRepository.findAndCount({
            take: size,
            skip: (page - 1) * size
        });
    }

    /*
     *  查询全部全局配置项
     */
    async queryAll() {
        return await this.settingsGlobalRepository.find();
    }

    /*
     * 通过ID查询全局配置项
     */
    async queryById(id: number) {
        return await this.settingsGlobalRepository.findOne({
            where: {
                id
            }
        });
    }
}
