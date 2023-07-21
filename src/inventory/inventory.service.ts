import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { Subcategory } from 'src/category/entities/subcategory.entity';
import { Category } from 'src/category/entities/category.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
  ) {}
  async createItem(createInventoryDto: CreateInventoryDto) {
    const {
      itemName,
      serialNumber,
      description,
      price,
      category,
      subCategoryId,
      vendor,
    } = createInventoryDto;
    //fetch category & subcategory from db
    const Category = await this.categoryRepository.findOneBy({
      id: category,
    });
    if (!Category) {
      throw new NotFoundException('Category not found');
    }

    const subcategory = await this.subcategoryRepository.findOneBy({
      id: subCategoryId,
    });
    if (!subcategory) {
      throw new NotFoundException('Subcategory not found');
    }

    //fetch Vendor
    const Vendor = await this.vendorRepository.findOneBy({
      id: vendor,
    });
    if (!Vendor) {
      throw new NotFoundException('Vendor not exist.');
    }

    const inventory = new Inventory();
    inventory.itemName = itemName;
    inventory.serialNumber = serialNumber;
    inventory.category = Category;
    inventory.subcategory = subcategory;
    inventory.description = description;
    inventory.price = price;
    inventory.vendor = Vendor;

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
    const category = await this.categoryRepository.findOneBy({
      id: +updateInventoryDto.category,
    });

    const subcategory = await this.subcategoryRepository.findOneBy({
      id: +updateInventoryDto.subCategoryId,
    });

    const Vendor = await this.vendorRepository.findOneBy({
      id: +updateInventoryDto.vendor,
    });

    const item = new Inventory();
    item.itemName = updateInventoryDto.itemName;
    item.serialNumber = updateInventoryDto.serialNumber;
    item.description = updateInventoryDto.description;
    item.price = updateInventoryDto.price;
    item.category = category;
    item.subcategory = subcategory;
    item.vendor = Vendor;

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
    const count = await this.inventoryRepository.count();
    const title = 'Inventory Items';
    const icon = count <= 5 ? false : true;
    const tagline = `${count} new items added`;

    return {
      number: count,
      icon: icon,
      title: title,
      tagline: tagline,
    };
  }
}
