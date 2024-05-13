import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { SysUserEntity } from "@/entities/system/sys-user.entity";
import { SysUserRoleEntity } from "@/entities/system/sys-user-role.entity";
import { CreateUserDto, PaginationSearchUserDto, UpdateUserDto } from "./user.dto";
import { BcryptUtil } from "@/utils/bcrypt";
import { camelCase, cloneDeep } from "lodash";
import SysRoleMenuEntity from "@/entities/system/sys-role-menu.entity";
import { SysMenuService } from "@/modules/system/menu/menu.service";
import { SysMenuEntity } from "@/entities/system/sys-menu.entity";

@Injectable()
export class SysUserService {
    constructor(
        @InjectRepository(SysUserEntity)
        private readonly userRepository: Repository<SysUserEntity>,
        @InjectRepository(SysUserRoleEntity)
        private readonly userRoleRepository: Repository<SysUserRoleEntity>,
        private readonly sysMenuService: SysMenuService,
        @InjectEntityManager()
        private entityManager: EntityManager
    ) {}

    /*
     * 创建用户
     */
    async create(params: CreateUserDto) {
        await this.entityManager.transaction(async (manager) => {
            const password = await BcryptUtil.hashPassword(params.password);
            const data = manager.create(SysUserEntity, {
                username: params.username,
                password: password,
                nickname: params.nickname,
                phone: params.phone,
                email: params.email,
                remark: params.remark,
                avatar: params.avatar
            });
            const result = await manager.save(data);
            const insertRoles = params.roles.map((i) => ({
                roleId: i,
                userId: result.id
            }));
            // 分配角色
            await manager.insert(SysUserRoleEntity, insertRoles);
        });
    }

    /*
     * 更新用户
     */
    async update(id: number, params: UpdateUserDto) {
        const updateParams: UpdateUserDto = cloneDeep(params);
        delete updateParams.roles;

        if (params.password) {
            updateParams.password = await BcryptUtil.hashPassword(params.password);
        } else {
            delete updateParams.password;
        }

        await this.entityManager.transaction(async (manager) => {
            // 更新用户信息
            await this.userRepository.update(id, updateParams);

            // 删除用户的所有角色
            await this.userRoleRepository.delete({ userId: id });

            // 添加新的角色
            const insertRoles = params.roles.map((i) => ({
                roleId: i,
                userId: id
            }));
            await manager.insert(SysUserRoleEntity, insertRoles);
        });
    }

    /*
     * 分页查询用户
     */
    async paginationQuery(params: PaginationSearchUserDto): Promise<[SysUserEntity[], number]> {
        const { page, size, username, phone, roles } = params;

        const qb = this.userRepository
            .createQueryBuilder("user")
            .innerJoinAndSelect("sys_user_role", "user_role", "user_role.user_id = user.id")
            .innerJoinAndSelect("sys_role", "role", "role.id = user_role.role_id")
            .select(["user.*", "GROUP_CONCAT(role.roleName) as roleNames", "GROUP_CONCAT(role.id) as roles"])
            .orderBy("user.created_at", "DESC")
            .groupBy("user.id")
            .offset((page - 1) * size)
            .limit(size);

        // 查询条件
        username && qb.andWhere("user.username LIKE :username", { username: `%${username}%` });
        phone && qb.andWhere("user.phone LIKE :phone", { phone: `%${phone}%` });
        roles && qb.andWhere("role.id IN (:...roles)", { roles });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, total] = await qb.getManyAndCount();
        const list = await qb.getRawMany();
        const processedList: SysUserEntity[] = list.map((n) => {
            const convertData = Object.entries<[string, any]>(n).map(([key, value]) => [camelCase(key), value]);
            return {
                ...Object.fromEntries(convertData),
                roles: (n.roles?.split(",") ?? []).map((item) => Number(item)),
                roleNames: n.roleNames?.split(",") ?? []
            };
        });

        return [processedList, total];
    }

    /*
     * 根据给定的条件查询单个用户
     * @param condition - 查询条件
     * @param includePassword - 是否返回用户的密码，默认为 false
     * @returns 返回满足条件的用户对象，如果找不到则返回 null
     */
    async queryOneByCondition(condition: Partial<SysUserEntity>, includePassword: boolean = false) {
        const currentUser = await this.userRepository.findOne({
            where: condition
        });
        if (!currentUser) return null;

        // 查询角色id、名称列表
        const userRoleList = await this.userRoleRepository.find({
            where: { userId: currentUser.id }
        });
        const roles = userRoleList.map((item) => item.roleId);
        const roleList = await this.entityManager.query(`SELECT role_name FROM sys_role WHERE id IN (?)`, [roles]);
        const roleNames = roleList.map((item) => item.role_name);

        return {
            ...currentUser,
            roles,
            roleNames,
            password: includePassword ? currentUser.password : null
        };
    }

    /*
     * 获取用户绑定角色下的菜单列表
     */
    async getUserRoleMenus(userId: number): Promise<SysMenuEntity[]> {
        // 查找用户绑定的角色ID
        const userRoles = await this.entityManager.find(SysUserRoleEntity, { where: { userId } });
        const roleIds = userRoles.map((userRole) => userRole.roleId);

        // 查找角色绑定的菜单ID
        const roleMenus = await this.entityManager.find(SysRoleMenuEntity, { where: { roleId: In(roleIds) } });
        const menuIds = roleMenus.map((roleMenu) => roleMenu.menuId);

        // 获取所有菜单
        const allMenus = await this.sysMenuService.queryAll();
        return this.sysMenuService.filterMenus(allMenus, menuIds);
    }

    /*
     * 删除用户
     */
    async remove(id: number) {
        await this.userRepository.delete(id);
        await this.userRoleRepository.delete({ userId: In([id]) });
    }
}
