import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/entities/base.entity";

@Entity({ name: "sys_user_role" })
export class SysUserRoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number; // 标记为主键，值自动生成

    @Column({ name: "user_id" })
    userId: number;

    @Column({ name: "role_id" })
    roleId: number;
}
