import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { User } from 'src/users/entities/user.entity';
import { Subcategory } from 'src/category/entities/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, User, Subcategory])],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule {}
