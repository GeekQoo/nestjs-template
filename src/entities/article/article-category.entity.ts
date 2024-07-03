import { BaseEntity } from "@/entities/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArticleEntity } from "@/entities/article/article.entity";

@Entity("article_category")
export class ArticleCategoryEntity extends BaseEntity {
    // 标记为主键，值自动生成
    @PrimaryGeneratedColumn()
    id: number;

    // 分类名称
    @Column({ name: "category_name" })
    categoryName: string;

    // 父级ID
    @Column({ name: "parent_id", nullable: true })
    parentId: number;

    // 子项
    children: ArticleCategoryEntity[];

    @OneToMany(() => ArticleEntity, (e) => e.categoryId)
    articles: ArticleEntity[];
}
