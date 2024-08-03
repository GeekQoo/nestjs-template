import { BaseEntity } from "@/entities/base.entity";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("settings_global")
export class SettingsGlobalEntity extends BaseEntity {
    @PrimaryColumn()
    id: number = 1;

    // 网站名称
    @Column({ name: "title", default: "", nullable: true })
    title: string;

    // 网站简介
    @Column({ name: "description", default: "", nullable: true })
    description?: string;

    // 网站详细介绍
    @Column({ name: "content", length: 1000, default: "", nullable: true })
    content?: string;

    // 网站logo
    @Column({ name: "logo", default: "", nullable: true })
    logo?: string;

    // 网站logo竖版
    @Column({ name: "logo_vertical", default: "", nullable: true })
    logoVertical?: string;

    // 网站备案号
    @Column({ name: "beian", default: "", nullable: true })
    beian?: string;

    // 网站公安备案号
    @Column({ name: "police_beian", default: "", nullable: true })
    policeBeian?: string;
}
