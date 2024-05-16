import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleCategoryEntity } from "@/entities/article/article-category.entity";
import {
    ArticleCategoryDto,
    PaginationSearchArticleCategoryDto
} from "@/modules/article/category/article-category.dto";

@Injectable()
export class ArticleCategoryService {
    constructor(
        @InjectRepository(ArticleCategoryEntity)
        private articleCategoryRepository: Repository<ArticleCategoryEntity>
    ) {}

    /*
     * 新增文章分类
     */
    async create(params: ArticleCategoryDto) {
        await this.articleCategoryRepository.save(params);
    }

    /*
     * 删除文章分类
     */
    async remove(id: number) {
        return await this.articleCategoryRepository.delete(id);
    }

    /*
     * 更新文章分类
     */
    async update(id: number, params: ArticleCategoryDto) {
        await this.articleCategoryRepository.update(id, params);
    }

    /*
     * 分页查询文章分类
     */
    async paginationQuery(params: PaginationSearchArticleCategoryDto) {
        const { page, size } = params;
        return await this.articleCategoryRepository.findAndCount({
            take: size,
            skip: (page - 1) * size
        });
    }

    /*
     * 通过ID查询文章分类
     */
    async queryById(id: number) {
        return await this.articleCategoryRepository.findOne({
            where: {
                id
            }
        });
    }

    /*
     * 通过parentId查询菜单
     */
    async findByParentId(parentId: number) {
        return await this.articleCategoryRepository.find({
            where: { parentId }
        });
    }

    /*
     * 查询全部文章分类并转换为树形结构
     */
    async queryAll() {
        const categories = await this.articleCategoryRepository.find();

        // 递归构建树形结构
        const buildTree = (categories: ArticleCategoryEntity[], parentId = null): ArticleCategoryEntity[] => {
            // 首先，过滤出所有parentId与给定值相等的分类项
            const filteredCategories = categories.filter((i) => i.parentId === parentId);

            // 然后，对每个过滤出的分类项进行映射，为其添加children属性
            return filteredCategories.map((i) => {
                const children = buildTree(categories, i.id);

                // 如果children为空，则不返回children字段
                return children.length > 0 ? { ...i, children } : { ...i };
            });
        };

        return buildTree(categories);
    }
}
