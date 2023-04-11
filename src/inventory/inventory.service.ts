import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}
  async createItem(createInventoryDto: CreateInventoryDto) {
    const item = await this.inventoryRepository.create(createInventoryDto);
    await this.inventoryRepository.save(item);
    return {
      message: `New Item Added successfully`,
      item: item,
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
    const item = new Inventory();
    item.itemName = updateInventoryDto.itemName;
    item.serialNumber = updateInventoryDto.serialNumber;
    item.description = updateInventoryDto.description;
    item.price = updateInventoryDto.price;

    const checkItem = await this.inventoryRepository.findOneBy({ id });
    if (!checkItem) {
      throw new NotFoundException(`Item ${id} not found`);
    }

    const updatedInventory = await this.inventoryRepository.update(id, item);

    return {
      message : `Item ${id} updated successfully`,
      item: item
    }
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
}
