import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/entities/base.entity";

@Entity("sys_menu")
export class SysMenuEntity extends BaseEntity {
    // 标记为主键，值自动生成
    @PrimaryGeneratedColumn()
    id: number;

    // 父菜单ID
    @Column({ name: "parent_id", nullable: true })
    parentId: number;

    // 菜单名
    @Column({ name: "menu_name" })
    menuName: string;

    // 菜单类型
    @Column({
        type: "tinyint",
        width: 1,
        default: 0,
        comment: "类型: 0=目录 1=菜单 2=权限"
    })
    type: number;

    // 菜单图标
    @Column({ nullable: true })
    icon: string;

    // 菜单路由
    @Column({ nullable: true })
    router: string;

    // 是否展示，默认为true
    @Column({ name: "is_show", type: "boolean", nullable: true, default: true })
    isShow: boolean;

    // 排序
    @Column({ name: "sort", type: "int", default: 0, nullable: true })
    sort: number;

    // 子项
    children: SysMenuEntity[];
}
