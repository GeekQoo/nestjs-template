import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleCategoryEntity } from "@/entities/article/article-category.entity";
import { ArticleCategoryController } from "@/modules/article/category/article-category.controller";
import { ArticleCategoryService } from "@/modules/article/category/article-category.service";
import { ArticleTagEntity } from "@/entities/article/article-tag.entity";
import { ArticleTagController } from "@/modules/article/tag/article-tag.controller";
import { ArticleTagService } from "@/modules/article/tag/article-tag.service";
import { ArticleEntity } from "@/entities/article/article.entity";
import { ArticleController } from "@/modules/article/article/article.controller";
import { ArticleService } from "@/modules/article/article/article.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([ArticleCategoryEntity, ArticleTagEntity, ArticleEntity]),
        RouterModule.register([
            {
                path: "/article",
                module: ArticleModule
            }
        ])
    ],
    controllers: [ArticleCategoryController, ArticleTagController, ArticleController],
    providers: [ArticleCategoryService, ArticleTagService, ArticleService]
})
export class ArticleModule {}
