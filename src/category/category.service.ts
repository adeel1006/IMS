import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    //for for the array of subCategories
    for (const subCategoryName of createCategoryDto.subCategoryName) {
      const subcategory = new Subcategory();
      subcategory.name = subCategoryName;
      subcategory.category = category;
      await this.subcategoryRepository.save(subcategory);
    }

    return {
      message: 'New Category created successfully',
      category: category,
    };
  }

  async findAllCategory() {
    return await this.categoryRepository.find({
      relations: ['vendors', 'items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCategoriesWithItemCount() {
    const categories = await this.categoryRepository.find({
      relations: ['items'],
    });

    const categoriesWithItemCount = categories
      ?.map((category) => ({
        name: category.categoryName,
        number: category.items.length,
      }))
      .filter((category) => category.number > 0);

    return categoriesWithItemCount;
  }

  // async getCategoriesWithItemCount(): Promise<{ name: string; assigned: number; unassigned: number }[]> {
  //   const categories = await this.categoryRepository.find({
  //     relations: ['items', 'items.vendor'],
  //   });

  //   const categoriesWithItemCount = categories.map((category) => {
  //     const assignedCount = category.items.filter((item) => item.vendor.id > 0).length;
  //     const unassignedCount = category.items.length - assignedCount;

  //     return {
  //       name: category.categoryName,
  //       assigned: assignedCount,
  //       unassigned: unassignedCount,
  //     };
  //   });

  //   return categoriesWithItemCount;
  // }

  async findAllCategoriesList() {
    const categories = await this.categoryRepository.find({
      relations: ['vendors', 'items'],
      order: { createdAt: 'DESC' },
    });
    return categories.map((category) => {
      let notAvailable = 'N/A';
      return {
        ID: category.id,
        CategoryName: category.categoryName,
        NumberofSubcategories: category.subcategories.length || notAvailable,
        NumberOfVendors: category.vendors.length || notAvailable,
        Action: 'Add or Delete',
        subcategories: category.subcategories.map((subcategory) => {
          const itemsInSubcategory = category.items.filter(
            (item) => item.subcategory.id === subcategory.id,
          );
          return {
            SubcategoryName: subcategory.name,
            VendorName:
              itemsInSubcategory[0]?.vendor?.vendorName || notAvailable,
            ItemsQuantity: itemsInSubcategory.length,
            Action: 'View',
          };
        }),
      };
    });
  }

  async findOneCategory(id: number) {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .leftJoinAndSelect('category.vendors', 'vendors')
      .leftJoinAndSelect('category.items', 'items')
      .leftJoinAndSelect('items.vendor', 'vendor')
      .getOne();

    if (!category) {
      throw new NotFoundException(`Category with ID #${id} not found`);
    }

    return {
      message: `Category with ID #${id}`,
      category: category,
    };
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOneBy({ id });

    if (!existingCategory) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    if (updateCategoryDto.categoryName) {
      existingCategory.categoryName = updateCategoryDto.categoryName;
      await this.categoryRepository.save(existingCategory);
    }

    if (
      updateCategoryDto.subCategoryName &&
      updateCategoryDto.subCategoryName.length > 0
    ) {
      for (const subCategoryName of updateCategoryDto.subCategoryName) {
        const subcategory = new Subcategory();
        subcategory.name = subCategoryName;
        subcategory.category = existingCategory;
        await this.subcategoryRepository.save(subcategory);
      }
    }

    return {
      message: `Category ${id} Updated Successfully`,
      category: existingCategory,
    };
  }

  async removeCategory(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`category ${id} not found`);
    }
    await this.categoryRepository.delete(id);
    return {
      message: `Category ${id} deleted successfully`,
      category: category,
    };
  }

  async categoryCount() {
    const count = await this.categoryRepository.count();
    const title = 'Categories';
    const icon = count <= 8 ? false : true;
    const tagline = `${count} new categories added`;

    return {
      number: count,
      icon: icon,
      title: title,
      tagline: tagline,
    };
  }
}
