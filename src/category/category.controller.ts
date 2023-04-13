import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Catch } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Catch(HttpException)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAllCategory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOneCategory(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.removeCategory(+id);
  }
  catch(error: HttpException){
    return {message: error.message}
  }
}
