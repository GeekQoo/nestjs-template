import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { SysMenuEntity } from "@/entities/system/sys-menu.entity";
import { CreateMenuDto, UpdateMenuDto } from "@/modules/system/menu/menu.dto";
import SysRoleMenuEntity from "@/entities/system/sys-role-menu.entity";

@Injectable()
export class SysMenuService {
    constructor(
        @InjectRepository(SysMenuEntity)
        private readonly menuRepository: Repository<SysMenuEntity>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ) {}

    /*
     * 新增菜单
     */
    async create(dto: CreateMenuDto) {
        return await this.menuRepository.save(dto);
    }

    /*
     * 更新菜单
     */
    async update(id: number, params: UpdateMenuDto) {
        const updateParams: UpdateMenuDto = { ...params };
        return await this.menuRepository.update(id, updateParams);
    }

    /*
     * 查询全部菜单并转换为树形结构
     */
    async queryAll() {
        const menus: SysMenuEntity[] = await this.menuRepository.find({
            order: { orderNum: "ASC" }
        });

        // 递归构建树形结构
        const buildTree = (menus: SysMenuEntity[], parentId = null): SysMenuEntity[] => {
            // 首先，过滤出所有parentId与给定值相等的菜单项
            const filteredMenus = menus.filter((i) => i.parentId === parentId);

            // 然后，对每个过滤出的菜单项进行映射，为其添加children属性
            return filteredMenus.map((i) => {
                const children = buildTree(menus, i.id);

                // 如果children为空，则不返回children字段
                return children.length > 0 ? { ...i, children } : { ...i };
            });
        };

        return buildTree(menus);
    }

    /*
     * 通过ID列表筛选出菜单树
     */
    filterMenus(menus: SysMenuEntity[], menuIds: number[]) {
        return menus.filter((menu) => {
            if (menuIds.includes(menu.id)) {
                if (menu.children?.length) {
                    menu.children = this.filterMenus(menu.children, menuIds);
                }
                return true;
            }
            return false;
        });
    }

    /*
     * 通过ID查询菜单详情
     */
    async queryById(id: number) {
        return await this.menuRepository.findOne({
            where: { id }
        });
    }

    /*
     * 通过parentId查询菜单
     */
    async findByParentId(parentId: number) {
        return await this.menuRepository.find({
            where: { parentId }
        });
    }

    /*
     * 检查菜单是否被角色绑定
     */
    async isMenuBoundToRole(menuId: number): Promise<boolean> {
        const count = await this.entityManager.count(SysRoleMenuEntity, { where: { menuId } });
        return count > 0;
    }

    /*
     * 删除菜单
     */
    async remove(id: number) {
        return await this.menuRepository.delete(id);
    }
}
