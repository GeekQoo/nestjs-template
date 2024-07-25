import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PaginationDataDto, ResponseDto } from "@/common/dto/response.dto";
import { LoginGuard } from "@/common/guard/login.guard";
import { ArticleDto, PaginationSearchArticleDto } from "@/modules/article/article/article.dto";
import { ArticleService } from "@/modules/article/article/article.service";
import { ArticleEntity } from "@/entities/article/article.entity";

@Controller("/")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    /*
     * 新增文章
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: ArticleDto) {
        await this.articleService.create(dto);
        return ResponseDto.success("新增成功");
    }

    /*
     * 更新文章
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() dto: ArticleDto) {
        const item = await this.articleService.queryOneByCondition({ id });
        if (!item) return ResponseDto.error("未找到该条数据");

        await this.articleService.update(id, dto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 分页查询文章
     */
    @Get()
    // @UseGuards(LoginGuard)
    async paginationQuery(
        @Query() dto: PaginationSearchArticleDto
    ): Promise<ResponseDto<PaginationDataDto<ArticleEntity>>> {
        const [list, total] = await this.articleService.paginationQuery(dto);

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
     * 通过ID查询文章
     */
    @Get(":id")
    // @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number) {
        const data = await this.articleService.queryOneByCondition({ id });
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }

    /*
     * 删除文章
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number) {
        const item = await this.articleService.queryOneByCondition({ id });
        if (!item) return ResponseDto.error("未找到该条数据");

        await this.articleService.remove(id);
        return ResponseDto.success("删除成功");
    }
}
