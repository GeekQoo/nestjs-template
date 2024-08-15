import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ArticleCategoryService } from "./article-category.service";
import { ArticleCategoryDto } from "./article-category.dto";
import { ResponseDto } from "@/common/dto/response.dto";
import { LoginGuard } from "@/common/guard/login.guard";
import { ArticleService } from "@/modules/article/article/article.service";

@Controller("category")
export class ArticleCategoryController {
    constructor(
        private readonly articleCategoryService: ArticleCategoryService,
        private readonly articleService: ArticleService
    ) {}

    /*
     * 新增文章分类
     */
    @Post()
    @UseGuards(LoginGuard)
    async create(@Body() dto: ArticleCategoryDto) {
        await this.articleCategoryService.create(dto);
        return ResponseDto.success("新增成功");
    }

    /*
     * 删除文章分类
     */
    @Delete(":id")
    @UseGuards(LoginGuard)
    async remove(@Param("id") id: number) {
        const item = await this.articleCategoryService.queryById(+id);
        if (!item) return ResponseDto.error("未找到该条数据");

        // 检查是否存在parentId为要删除的id的子分类
        const children = await this.articleCategoryService.findByParentId(id);
        if (children.length > 0) return ResponseDto.error("存在子分类，无法删除");

        // 检查该分类下是否存在文章
        const articles = await this.articleService.queryByCategoryId(id);
        if (articles.length > 0) return ResponseDto.error("该分类下存在文章，无法删除");

        await this.articleCategoryService.remove(id);
        return ResponseDto.success("删除成功");
    }

    /*
     * 更新文章分类
     */
    @Patch(":id")
    @UseGuards(LoginGuard)
    async update(@Param("id") id: number, @Body() dto: ArticleCategoryDto) {
        await this.articleCategoryService.update(id, dto);
        return ResponseDto.success("更新成功");
    }

    /*
     * 查询全部文章分类
     */
    @Get()
    @UseGuards(LoginGuard)
    async queryAll() {
        const data = await this.articleCategoryService.queryAll();
        return ResponseDto.success(data);
    }

    /*
     * 通过ID查询文章分类
     */
    @Get(":id")
    // @UseGuards(LoginGuard)
    async queryById(@Param("id") id: number) {
        const data = await this.articleCategoryService.queryById(id);
        if (data) {
            return ResponseDto.success(data);
        } else {
            return ResponseDto.error("未找到该条数据");
        }
    }
}
