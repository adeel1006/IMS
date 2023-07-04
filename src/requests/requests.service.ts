import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Subcategory } from 'src/category/entities/subcategory.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request) private requestRepository: Repository<Request>,
    @InjectRepository(Subcategory)
    private subCategoryRepository: Repository<Subcategory>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createRequest(createRequestDto: CreateRequestDto, currentUser) {
    const { userId } = currentUser;

    // Destructure the payload
    const { itemName, requestType, description, subCategory } = createRequestDto;
    const sub_category = new Subcategory();
    sub_category.name = subCategory;

    //Checks User Id exists & Fetch User Object
    const user = await this.userRepository.findOneBy({  id: userId  });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Create a new Request object and assign the values
    const request = new Request();
    request.itemName = itemName;
    request.requestType = requestType;
    request.subcategory = sub_category;
    request.description = description;
    request.status = "pending";
    request.user = user;

    // Save the request to the database
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
    const request = await this.requestRepository.findOneBy({ id });

    const { itemName, requestType, subCategory, description } =
      updateRequestDto;

    // Find the subcategory by name
    const subcategory = await this.subCategoryRepository.findOneBy({
      name: subCategory,
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory "${subCategory}" not found`);
    }

    request.itemName = itemName;
    request.requestType = requestType;
    request.description = description;
    request.subcategory = subcategory;
    await this.requestRepository.save(request);
    return {
      message: `request ${id} updated successfully`,
      request: request,
    };
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
