import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { Vendor } from './entities/vendor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from 'src/category/entities/subcategory.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, Category, Subcategory])],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
