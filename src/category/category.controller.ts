import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Catch,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CONSTANTS } from 'src/users/constants';
import { CurrentUser } from 'src/customDecorators/user.decorator';

@Catch(HttpException)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  create(
    @CurrentUser() currentUser,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get('list')
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  findAllCategoriesList(@CurrentUser() currentUser) {
    return this.categoryService.findAllCategoriesList();
  }

  @Get('inventory')
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  getCategoriesWithItemCount(@CurrentUser() currentUser) {
    return this.categoryService.getCategoriesWithItemCount();
  }

  @Get()
  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  findAll(@CurrentUser() currentUser) {
    return this.categoryService.findAllCategory();
  }

  @Get('categoriesCount')
  @Get()
  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  async categoriesCount(@CurrentUser() currentUser) {
    return await this.categoryService.categoryCount();
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  @Get(':id')
  findOne(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.categoryService.findOneCategory(+id);
  }

  @UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
  @Patch(':id')
  update(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(+id, updateCategoryDto);
  }

  @UseGuards(
    JwtAuthGuard,
    new RoleGuard([CONSTANTS.ROLES.ADMIN, CONSTANTS.ROLES.EMPLOYEE]),
  )
  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.categoryService.removeCategory(+id);
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
