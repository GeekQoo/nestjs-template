import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "@/common/filters/http-exception.filter";
import { HttpTransformInterceptor } from "@/common/interceptors/http-transform.interceptor";
import { HttpStatus, UnprocessableEntityException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 允许跨域
    app.enableCors({
        origin: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true
    });

    // 全局校验转换
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            exceptionFactory: (errors: ValidationError[]) => {
                return new UnprocessableEntityException(
                    errors
                        .filter((item) => !!item.constraints)
                        .flatMap((item) => Object.values(item.constraints))
                        .join(";")
                );
            }
        })
    );

    // 全局拦截器
    app.useGlobalInterceptors(new HttpTransformInterceptor());

    // 全局过滤器
    app.useGlobalFilters(new HttpExceptionFilter());

    // 监听端口
    await app.listen(3000);
}

bootstrap();
