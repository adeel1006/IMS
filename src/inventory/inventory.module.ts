import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Subcategory } from 'src/category/entities/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory,Subcategory])],
  controllers: [InventoryController],
  providers: [InventoryService]
})
export class InventoryModule {}
