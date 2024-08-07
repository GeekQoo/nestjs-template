import { BaseEntity } from "@/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("settings_global")
export class SettingsGlobalEntity extends BaseEntity {
    // 标记为主键，值自动生成
    @PrimaryGeneratedColumn()
    id: number;

    // 配置项名称
    @Column({ name: "name", default: "", nullable: true })
    name: string;

    // 配置项Key
    @Column({ name: "key" })
    key: string;

    // 配置项值
    @Column({ name: "value", default: "", nullable: true })
    value: string;

    // 配置项排序
    @Column({ name: "sort", default: 0 })
    sort: number;
}
