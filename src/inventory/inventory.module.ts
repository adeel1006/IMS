import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Subcategory } from 'src/category/entities/subcategory.entity';
import { Category } from 'src/category/entities/category.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, Category, Subcategory, Vendor]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
