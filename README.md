# Nest.js template

本项目是一个基于 Nest.js 的后端模板，用于快速构建后端服务。

## 使用@nestjs/cli创建项目

```bash
$ pnpm i -g @nestjs/cli
$ nest new project-name
```

使用全局安装的方法需要定期升级版本。

```bash
pnpm update -g @nestjs/cli
```

如果不想升级版本，可以使用npx的方法创建项目。

```bash
npx @nestjs/cli new project-name
```

## 使用@nestjs/cli创建资源

```bash
$ nest g resource resource-name
```

## 使用TypeORM连接数据库

### 安装依赖

```bash
$ pnpm i @nestjs/typeorm typeorm mysql2 -S
```

### 配置全局Module

```typescript
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductMoudle } from "./goods/goods.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        ProductMoudle,
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost", // 数据库地址，不带http/https
            port: 3306, // 数据库端口
            username: "root", // 数据库用户名
            password: "root", // 数据库密码
            database: "root", // 数据库名称
            // entities: [], //实体文件，删了好像不影响，先注释掉
            synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
            retryDelay: 500, //重试连接数据库间隔
            retryAttempts: 10, //重试连接数据库的次数
            autoLoadEntities: true //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
```

### 配置Service

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./entities/product.entity";
// ...省略其他引入

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly product: Repository<ProductEntity>
    ) {}
    // ...省略其他方法
}
```

### 在module中引入

```typescript
import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity])],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule {}
```

### 配置Entity

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number; // 标记为主键，值自动生成

    @Column({ length: 20 })
    name: string;

    @Column({ length: 20 })
    description: string;

    @Column({ length: 20 })
    images: string;
}
```

顺利做完上面几步，再去数据库里看看，是不是已经自动创建了表，并且有了对应的字段，如果都有了，那么恭喜你，你已经成功连接数据库了。
