import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingsBannerController } from "@/modules/settings/banner/settings-banner.controller";
import { SettingsBannerService } from "@/modules/settings/banner/settings-banner.service";
import { SettingsBannerEntity } from "@/entities/settings/settings-banner.entity";
import { SettingsGlobalEntity } from "@/entities/settings/settings-global.entity";
import { SettingsGlobalController } from "@/modules/settings/global/settings-global.controller";
import { SettingsGlobalService } from "@/modules/settings/global/settings-global.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([SettingsBannerEntity, SettingsGlobalEntity]),
        RouterModule.register([
            {
                path: "/settings",
                module: SettingsModule
            }
        ])
    ],
    controllers: [SettingsBannerController, SettingsGlobalController],
    providers: [SettingsBannerService, SettingsGlobalService]
})
export class SettingsModule {}
