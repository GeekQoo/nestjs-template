import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleTagEntity } from "@/entities/article/article-tag.entity";
import { ArticleTagDto, PaginationSearchArticleTagDto } from "@/modules/article/tag/article-tag.dto";

@Injectable()
export class ArticleTagService {
    constructor(
        @InjectRepository(ArticleTagEntity)
        private articleTagRepository: Repository<ArticleTagEntity>
    ) {}

    /*
     * 新增文章标签
     */
    async create(params: ArticleTagDto) {
        await this.articleTagRepository.save(params);
    }

    /*
     * 删除文章标签
     */
    async remove(id: number) {
        return await this.articleTagRepository.delete(id);
    }

    /*
     * 更新文章标签
     */
    async update(id: number, params: ArticleTagDto) {
        await this.articleTagRepository.update(id, params);
    }

    /*
     * 分页查询文章标签
     */
    async paginationQuery(params: PaginationSearchArticleTagDto) {
        const { page, size } = params;
        return await this.articleTagRepository.findAndCount({
            take: size,
            skip: (page - 1) * size
        });
    }

    /*
     * 通过ID查询文章标签
     */
    async queryById(id: number) {
        return await this.articleTagRepository.findOne({
            where: {
                id
            }
        });
    }
}
