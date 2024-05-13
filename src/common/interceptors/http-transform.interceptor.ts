import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ResponseDto } from "@/common/dto/response.dto";

@Injectable()
export class HttpTransformInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
        return next.handle().pipe(
            map((data) => {
                return data;
            })
        );
    }
}
