import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/entities/base.entity";

@Entity("sys_role")
export class SysRoleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number; // 标记为主键，值自动生成

    // 角色名需唯一
    @Column({ name: "role_name", unique: true })
    roleName: string;

    // 备注
    @Column({ nullable: true, default: "" })
    remark: string;
}
