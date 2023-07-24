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
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`category ${id} not found`);
    }
    return {
      message: `category with ID #${id}`,
      category: category,
    };
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = new Category();
    category.categoryName = updateCategoryDto.categoryName;

    const checkCategoryId = await this.categoryRepository.findOneBy({ id });
    if (!checkCategoryId) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    const updateCategory = await this.categoryRepository.update(id, category);
    return {
      message: `Category ${id} Updated Successfully`,
      category: category,
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
