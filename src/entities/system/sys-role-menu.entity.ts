import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/entities/base.entity";

@Entity({ name: "sys_role_menu" })
export default class SysRoleMenuEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "role_id" })
    roleId: number;

    @Column({ name: "menu_id" })
    menuId: number;
}
