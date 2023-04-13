import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private requestRepository: Repository<Request>,
  ) {}
  async createRequest(createRequestDto: CreateRequestDto) {
    const request = await this.requestRepository.create(createRequestDto);
    await this.requestRepository.save(request);
    return {
      message: `New Request Created`,
      request: request,
    };
  }

  async findAllRequests() {
    return await this.requestRepository.find();
  }

  async findOneRequest(id: number) {
    const request = await this.requestRepository.findOneBy({ id });
    if (!request) {
      throw new NotFoundException(`request ${id} not found`);
    }
    return {
      message: `request ${id}`,
      request: request,
    };
  }

  async updateRequest(id: number, updateRequestDto: UpdateRequestDto) {
    const request = new Request();
    request.requestType = updateRequestDto.requestType;
    request.description = updateRequestDto.description;

    const checkrequest = await this.requestRepository.findOneBy({ id });
    if (!checkrequest) {
      throw new NotFoundException(`request ${id} not found`);
    }

    const updatedInventory = await this.requestRepository.update(id, request);

    return {
      message : `request ${id} updated successfully`,
      request: request
    }
  }

  async removeRequest(id: number) {
    const request = await this.requestRepository.findOneBy({ id });
    if (!request) {
      throw new NotFoundException(`request ${id} not found`);
    }
    await this.requestRepository.delete(id);
    return {
      message: `request ${id} deleted successfully`,
      request: request,
    };
  }
}
