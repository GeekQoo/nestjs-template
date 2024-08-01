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
            if (!params.summary) {
                params.summary = params.content?.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200) || "";
            }
            const data = manager.create(ArticleEntity, {
                title: params.title,
                content: params.content,
                summary: params.summary,
                thumbnail: params.thumbnail,
                categoryId: params.categoryId,
                tagIds: params.tagIds
            });
            await manager.save(data);
            await manager.insert(
                "article_tag_relation",
                (params.tagIds || []).map((i) => ({
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

            if (!updateParams.summary) {
                updateParams.summary = updateParams.content?.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200) || "";
            }

            await manager.update(ArticleEntity, id, updateParams);

            // 删除文章标签关联
            await manager.delete("article_tag_relation", { article_id: id });

            // 添加新的标签关联
            await manager.insert(
                "article_tag_relation",
                (params.tagIds || []).map((i) => ({
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
            skip: (page - 1) * size,
            relations: ["tags", "category"]
        });
    }

    /*
     * 根据给定的条件查询单个文章
     * @param condition - 查询条件
     * @returns 返回满足条件的用户对象，如果找不到则返回 null
     */
    async queryOneByCondition(condition: FindOptionsWhere<ArticleEntity>) {
        const item = await this.articleRepository.findOne({
            where: condition,
            relations: ["tags", "category"]
        });

        if (!item) return null;

        return item;
    }

    /*
     * 通过关联的分类ID查询文章
     */
    async queryByCategoryId(categoryId: number) {
        return await this.articleRepository.find({
            where: { categoryId }
        });
    }

    /*
     * 通过关联的标签ID查询文章
     */
    async queryByTagId(tagId: number) {
        return await this.articleRepository
            .createQueryBuilder("article")
            .leftJoin("article.tags", "tag")
            .where("tag.id = :tagId", { tagId })
            .getMany();
    }

    /*
     *  删除文章
     */
    async remove(id: number) {
        await this.articleRepository.delete(id);
    }
}
