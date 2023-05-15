import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Catch } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Catch(HttpException)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {} 

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.createRequest(createRequestDto);
  }

  @Get()
  findAll() {
    return this.requestsService.findAllRequests();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestsService.findOneRequest(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.updateRequest(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.removeRequest(+id);
  }
  catch(error: HttpException) {
    return { message: error.message };
  }
}
