import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/entities/base.entity";
import { ArticleCategoryEntity } from "./article-category.entity";
import { ArticleTagEntity } from "./article-tag.entity";

@Entity("article")
export class ArticleEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "title" })
    title: string;

    @Column({ name: "content", length: 10000 })
    content: string;

    @Column({ name: "tag_ids", type: "json" })
    tagIds: number[];

    @Column({ name: "category_id" })
    categoryId: number;

    @ManyToOne(() => ArticleCategoryEntity, (e) => e.articles)
    @JoinColumn({ name: "category_id" })
    category: ArticleCategoryEntity;

    @ManyToMany(() => ArticleTagEntity)
    @JoinTable({
        name: "article_tag_relation",
        joinColumn: { name: "article_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" }
    })
    tags: ArticleTagEntity[];
}
