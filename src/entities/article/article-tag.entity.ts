import { BaseEntity } from "@/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("article_tag")
export class ArticleTagEntity extends BaseEntity {
    // 标记为主键，值自动生成
    @PrimaryGeneratedColumn()
    id: number;

    // 标签名称
    @Column({ name: "tag_name" })
    tagName: string;
}
