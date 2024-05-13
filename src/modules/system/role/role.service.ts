import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { SysRoleEntity } from "@/entities/system/sys-role.entity";
import { CreateRoleDto, PaginationSearchRoleDto, UpdateRoleDto } from "@/modules/system/role/role.dto";
import SysRoleMenuEntity from "@/entities/system/sys-role-menu.entity";
import { cloneDeep } from "lodash";
import { SysUserRoleEntity } from "@/entities/system/sys-user-role.entity";

@Injectable()
export class SysRoleService {
    constructor(
        @InjectRepository(SysRoleEntity)
        private readonly roleRepository: Repository<SysRoleEntity>,
        @InjectEntityManager()
        private entityManager: EntityManager
    ) {}

    /*
     * 创建角色
     */
    async create(params: CreateRoleDto) {
        await this.entityManager.transaction(async (manager) => {
            const data = manager.create(SysRoleEntity, {
                roleName: params.roleName,
                remark: params.remark
            });
            const result = await manager.save(data);
            // 绑定菜单
            const insertMenus = (params.menus ?? []).map((i) => ({
                roleId: result.id,
                menuId: i
            }));
            await manager.insert(SysRoleMenuEntity, insertMenus);
        });
    }

    /*
     * 更新角色
     */
    async update(id: number, params: UpdateRoleDto) {
        await this.entityManager.transaction(async (manager) => {
            const updateParams: UpdateRoleDto = cloneDeep(params);
            delete updateParams.menus;

            // 更新角色信息
            await manager.update(SysRoleEntity, id, updateParams);

            // 删除角色的所有菜单
            await manager.delete(SysRoleMenuEntity, { roleId: id });

            // 添加新的菜单
            const insertMenus = (params.menus ?? []).map((i) => ({
                roleId: id,
                menuId: i
            }));
            await manager.insert(SysRoleMenuEntity, insertMenus);
        });
    }

    /*
     * 分页查询角色
     */
    async paginationQuery(params: PaginationSearchRoleDto) {
        const { page, size } = params;
        return await this.roleRepository.findAndCount({
            take: size,
            skip: (page - 1) * size
        });
    }

    /*
     * 查询所有角色
     */
    async queryAll() {
        return await this.roleRepository.find();
    }

    /*
     * 通过ID查询角色
     */
    async queryById(id: number) {
        return await this.roleRepository.findOne({
            where: {
                id
            }
        });
    }

    /*
     * 通过ID查询角色绑定菜单
     */
    async getRoleMenus(roleId: number): Promise<number[]> {
        const roleMenus = await this.entityManager.find(SysRoleMenuEntity, { where: { roleId } });
        return roleMenus.map((roleMenu) => roleMenu.menuId);
    }

    /*
     * 检查角色是否被用户绑定
     */
    async isRoleBoundToUser(roleId: number): Promise<boolean> {
        const count = await this.entityManager.count(SysUserRoleEntity, { where: { roleId } });
        return count > 0;
    }

    /*
     * 删除角色
     */
    async remove(id: number) {
        return await this.roleRepository.delete(id);
    }
}
