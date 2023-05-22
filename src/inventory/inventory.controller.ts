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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CONSTANTS } from 'src/users/constants';
import { CurrentUser } from 'src/customDecorators/user.decorator';

@Catch(HttpException)
@UseGuards(JwtAuthGuard, new RoleGuard([CONSTANTS.ROLES.ADMIN]))
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(
    @CurrentUser() currentUser,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    return this.inventoryService.createItem(createInventoryDto);
  }

  @Get()
  findAll(@CurrentUser() currentUser) {
    return this.inventoryService.findAllItems();
  }

  @Get(':id')
  findOne(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.inventoryService.findOneItem(+id);
  }

  @Patch(':id')
  update(
    @CurrentUser() currentUser,
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.updateItem(+id, updateInventoryDto);
  }

  @Delete(':id')
  remove(@CurrentUser() currentUser, @Param('id') id: string) {
    return this.inventoryService.removeItem(+id);
  }

  @Get('inventoryItems')
  async countResolvedComplaints(@CurrentUser() currentUser) {
    const count = await this.inventoryService.inventoryItemsCount();
    return { count };
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
