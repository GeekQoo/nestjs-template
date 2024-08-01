import { BaseEntity } from "@/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("settings_banner")
export class SettingsBannerEntity extends BaseEntity {
    // 标记为主键，值自动生成
    @PrimaryGeneratedColumn()
    id: number;

    // 标题
    @Column({ name: "title" })
    title: string;

    // 简介
    @Column({ name: "description" })
    description: string;

    // 图片地址
    @Column({ name: "image_url" })
    imageUrl: string;

    // 跳转链接
    @Column({ name: "link_url" })
    linkUrl: string;

    // 排序
    @Column({ name: "sort" })
    sort: number;
}
