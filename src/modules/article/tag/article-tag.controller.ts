import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ArticleTagService } from "./article-tag.service";
import { ArticleTagDto, PaginationSearchArticleTagDto } from "./article-tag.dto";
import { PaginationDataDto, ResponseDto } from "@/common/dto/response.dto";
import { LoginGuard } from "@/common/guard/login.guard";
import { ArticleTagEntity } from "@/entities/article/article-tag.entity";
import { ArticleService } from "@/modules/article/article/article.service";

@Controller("tag")
export class ArticleTagController {
    constructor(
        private readonly articleTagService: ArticleTagService,
        private readonly articleService: ArticleService
    ) {}

    /*
     * 新增文章标签
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: ArticleTagDto) {
        await this.articleTagService.create(dto);
        return ResponseDto.success("新增成功");
    }

    /*
     * 删除文章标签
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number) {
        const item = await this.articleTagService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");

        // 查询标签下是否存在文章
        const articles = await this.articleService.queryByTagId(id);
        if (articles.length > 0) return ResponseDto.error("该标签下存在文章，无法删除");

        await this.articleTagService.remove(id);
        return ResponseDto.success("删除成功");
    }

    /*
     * 更新文章标签
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() dto: ArticleTagDto) {
        await this.articleTagService.update(id, dto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 分页查询文章标签
     */
    @Get()
    @UseGuards(LoginGuard)
    async paginationQuery(
        @Query() dto: PaginationSearchArticleTagDto
    ): Promise<ResponseDto<PaginationDataDto<ArticleTagEntity>>> {
        const [list, total] = await this.articleTagService.paginationQuery(dto);

        const data = {
            list: list,
            pagination: {
                page: dto.page,
                size: dto.size,
                total
            }
        };
        return ResponseDto.success(data);
    }

    /*
     * 通过ID查询文章标签
     */
    @Get(":id")
    @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number) {
        const data = await this.articleTagService.queryById(id);
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }
}
