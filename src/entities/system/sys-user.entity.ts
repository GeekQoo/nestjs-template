import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/entities/base.entity";

@Entity("sys_user")
export class SysUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number; // 标记为主键，值自动生成

    // 用户名需唯一
    @Column({ unique: true })
    username: string;

    // 密码
    @Column({ nullable: true, default: "" })
    password: string;

    // 昵称
    @Column({ nullable: true, default: "" })
    nickname: string;

    // 邮箱
    @Column({ nullable: true, default: "" })
    email: string;

    // 手机号
    @Column({ nullable: true, default: "" })
    phone: string;

    // 备注
    @Column({ nullable: true, default: "" })
    remark: string;

    // 头像
    @Column({ nullable: true, default: "" })
    avatar: string;
}
