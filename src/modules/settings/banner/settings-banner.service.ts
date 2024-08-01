import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SettingsBannerEntity } from "@/entities/settings/settings-banner.entity";
import { PaginationSearchSettingsBannerDto, SettingsBannerDto } from "./settings-banner.dto";

@Injectable()
export class SettingsBannerService {
    constructor(
        @InjectRepository(SettingsBannerEntity)
        private settingsBannerRepository: Repository<SettingsBannerEntity>
    ) {}

    /*
     * 新增幻灯片
     */
    async create(params: SettingsBannerDto) {
        await this.settingsBannerRepository.save(params);
    }

    /*
     * 删除幻灯片
     */
    async remove(id: number) {
        return await this.settingsBannerRepository.delete(id);
    }

    /*
     * 更新幻灯片
     */
    async update(id: number, params: SettingsBannerDto) {
        await this.settingsBannerRepository.update(id, params);
    }

    /*
     * 分页查询幻灯片
     */
    async paginationQuery(params: PaginationSearchSettingsBannerDto) {
        const { page, size } = params;
        return await this.settingsBannerRepository.findAndCount({
            take: size,
            skip: (page - 1) * size
        });
    }

    /*
     *  查询全部幻灯片
     */
    async queryAll() {
        return await this.settingsBannerRepository.find();
    }

    /*
     * 通过ID查询幻灯片
     */
    async queryById(id: number) {
        return await this.settingsBannerRepository.findOne({
            where: {
                id
            }
        });
    }
}
