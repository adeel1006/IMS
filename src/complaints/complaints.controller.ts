import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Catch,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/customDecorators/user.decorator';

@Catch(HttpException)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() currentUser: any,
    @Body() createComplaintDto: CreateComplaintDto,
  ) {
    return this.complaintsService.createComplain(currentUser,createComplaintDto);
  }

  @Get()
  findAll() {
    return this.complaintsService.findAllComplaints();
  }

  @Get('status')
  findAllComplaintStatus() {
    return this.complaintsService.getComplaintsStatus();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOneComplaint(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComplaintDto: UpdateComplaintDto,
  ) {
    return this.complaintsService.updateComplaint(+id, updateComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintsService.removeComplaint(+id);
  }

  catch(error: HttpException) {
    return { message: error.message };
  }
}
