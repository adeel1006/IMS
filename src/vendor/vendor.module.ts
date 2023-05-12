import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { Vendor } from './entities/vendor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from 'src/category/entities/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, Subcategory])],
  controllers: [VendorController],
  providers: [VendorService]
})
export class VendorModule {}
