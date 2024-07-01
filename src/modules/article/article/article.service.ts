import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, FindOptionsWhere, Repository } from "typeorm";
import { ArticleEntity } from "@/entities/article/article.entity";
import { ArticleDto, PaginationSearchArticleDto } from "@/modules/article/article/article.dto";
import { cloneDeep } from "lodash";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private articleRepository: Repository<ArticleEntity>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ) {}

    /*
     * 新增文章
     */
    async create(params: ArticleDto) {
        await this.entityManager.transaction(async (manager) => {
            const data = manager.create(ArticleEntity, {
                title: params.title,
                content: params.content,
                categoryId: params.categoryId
            });
            await manager.save(data);
            await manager.insert(
                "article_tag_relation",
                (params.tags || []).map((i) => ({
                    article_id: data.id,
                    tag_id: i
                }))
            );
        });
    }

    /*
     * 更新文章
     */
    async update(id: number, params: ArticleDto) {
        await this.entityManager.transaction(async (manager) => {
            // 更新文章信息
            const updateParams: ArticleDto = cloneDeep(params);
            delete updateParams.tags;
            await manager.update(ArticleEntity, id, updateParams);

            // 删除文章标签关联
            await manager.delete("article_tag_relation", { article_id: id });

            // 添加新的标签关联
            await manager.insert(
                "article_tag_relation",
                (params.tags || []).map((i) => ({
                    article_id: id,
                    tag_id: i
                }))
            );
        });
    }

    /*
     * 分页查询文章
     */
    async paginationQuery(params: PaginationSearchArticleDto) {
        const { page, size } = params;
        return await this.articleRepository.findAndCount({
            take: size,
            skip: (page - 1) * size
        });
    }

    /*
     * 根据给定的条件查询单个文章
     * @param condition - 查询条件
     * @returns 返回满足条件的用户对象，如果找不到则返回 null
     */
    async queryOneByCondition(condition: FindOptionsWhere<ArticleEntity>) {
        const item = await this.articleRepository.findOne({
            where: condition
        });

        if (!item) return null;

        const tags = await this.entityManager.query(`
            SELECT tag_id FROM article_tag_relation WHERE article_id = ${item.id}
        `);
        return {
            ...item,
            tags: tags.map((i) => i.tag_id)
        };
    }

    /*
     * 通过关联的分类ID查询文章
     */
    async queryByCategoryId(categoryId: number) {
        const qb = this.articleRepository.createQueryBuilder("article");
        qb.innerJoinAndSelect("article.categoryId", "category").where("category.id = :categoryId", { categoryId });
        return await qb.getMany();
    }

    /*
     *  删除文章
     */
    async remove(id: number) {
        await this.articleRepository.delete(id);
    }
}
