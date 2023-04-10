import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    return {
      message: 'New Category created successfully',
      category: category,
    };
  }

  async findAllCategory() {
    return await this.categoryRepository.find();
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
    category.subCategoryName = updateCategoryDto.subCategoryName;

    const checkCategoryId = await this.categoryRepository.findOneBy({id})
    if(!checkCategoryId){
      throw new NotFoundException(`Category ${id} not found`);
    }

    const updateCategory = await this.categoryRepository.update(id, category);
    return {
      message: `Category ${id} Updated Successfully`,
      category: category,
    }
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
}
