import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingsBannerController } from "@/modules/settings/banner/settings-banner.controller";
import { SettingsBannerService } from "@/modules/settings/banner/settings-banner.service";
import { SettingsBannerEntity } from "@/entities/settings/settings-banner.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([SettingsBannerEntity]),
        RouterModule.register([
            {
                path: "/settings",
                module: SettingsModule
            }
        ])
    ],
    controllers: [SettingsBannerController],
    providers: [SettingsBannerService]
})
export class SettingsModule {}
