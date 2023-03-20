import{
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from "rxjs/operators";
import { plainToClass } from 'class-transformer';
import { Userdto } from 'src/users/Models/dto/user.dto';

export class SerializeInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any > {
        //Run something before the request is handled
        //by thr request handler
        // console.log("I am running before the handler",context); 

        return handler.handle().pipe(
            map((data:any)=>{
                //Runs something before the response is sent out
                console.log("I am running before the response is sent out");
                return plainToClass(Userdto, data, {
                    excludeExtraneousValues: true,
                })
            })
        )
    }    
}