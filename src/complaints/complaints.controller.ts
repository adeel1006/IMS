import { Controller, Get, Post, Body, Patch, Param, Delete, Catch, HttpException} from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Catch(HttpException)
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post()
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintsService.createComplain(createComplaintDto);
  }

  @Get()
  findAll() {
    return this.complaintsService.findAllComplaints();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complaintsService.findOneComplaint(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    return this.complaintsService.updateComplaint(+id, updateComplaintDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complaintsService.removeComplaint(+id);
  }

  catch ( error : HttpException){
    return { message: error.message}
  }
}
