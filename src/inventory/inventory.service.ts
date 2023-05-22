import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { Subcategory } from 'src/category/entities/subcategory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}
  async createItem(createInventoryDto: CreateInventoryDto) {
    const { itemName, serialNumber, description, price, subCategoryId } =
      createInventoryDto;
    const subcategory = await this.subcategoryRepository.findOneBy({
      id: subCategoryId,
    });

    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }
    const inventory = new Inventory();
    inventory.itemName = itemName;
    inventory.serialNumber = serialNumber;
    inventory.description = description;
    inventory.price = price;
    inventory.subcategory = subcategory;

    await this.inventoryRepository.save(inventory);

    return {
      message: `New Item Added successfully`,
      item: inventory,
    };
  }

  async findAllItems() {
    return await this.inventoryRepository.find();
  }

  async findOneItem(id: number) {
    const item = await this.inventoryRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`Item ${id} not found`);
    }
    return {
      message: `Item ${id}`,
      item: item,
    };
  }

  async updateItem(id: number, updateInventoryDto: UpdateInventoryDto) {
    const subcategory = await this.subcategoryRepository.findOneBy({
      id: updateInventoryDto.subCategoryId,
    });

    const item = new Inventory();
    item.itemName = updateInventoryDto.itemName;
    item.serialNumber = updateInventoryDto.serialNumber;
    item.description = updateInventoryDto.description;
    item.price = updateInventoryDto.price;
    item.subcategory = subcategory;

    const checkItem = await this.inventoryRepository.findOneBy({ id });
    if (!checkItem) {
      throw new NotFoundException(`Item ${id} not found`);
    }

    await this.inventoryRepository.update(id, item);

    return {
      message: `Item ${id} updated successfully`,
      item: item,
    };
  }

  async removeItem(id: number) {
    const item = await this.inventoryRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`item ${id} not found`);
    }
    await this.inventoryRepository.delete(id);
    return {
      message: `item ${id} deleted successfully`,
      item: item,
    };
  }

  async inventoryItemsCount() {
    const count = this.inventoryRepository.count();

    return count;
  }
}
