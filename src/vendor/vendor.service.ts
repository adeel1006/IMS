import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor) 
    private vendorRepository: Repository<Vendor>,
  ) {}
  async createVendor(createVendorDto: CreateVendorDto) {
    const vendor = await this.vendorRepository.create(createVendorDto);
    await this.vendorRepository.save(vendor);
    return {
      message: "New Vendor created successfully",
      vendor: vendor
    };
  }

  async findAllVendor() {
    return await this.vendorRepository.find();
  }

  async findOneVendor(id: number) {
    const vendor = await this.vendorRepository.findOneBy({id});
    if(!vendor){
      throw new NotFoundException(`Vendor ${id} not found`);
    }
    return {
      message:`Vendor with ID #${id}`,
      vendor: vendor
    }
  }

  async updateVendor(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor  = new Vendor();
    vendor.vendorName = updateVendorDto.vendorName
    vendor.contactNumber = updateVendorDto.contactNumber
    vendor.category = updateVendorDto.category
    vendor.subCategory = updateVendorDto.subCategory
    vendor.totalSpendings = updateVendorDto.totalSpendings
    vendor.action = updateVendorDto.action

    const checkVendorId = await this.vendorRepository.findOneBy({id})
    if(!checkVendorId){
      throw new NotFoundException(`Vendor with ID-${id} not found`);
    }
    const updateVendor = await this.vendorRepository.update(id,vendor)
    return {
      message: `Vendor ${id} Updated successfully`,
      vendor: vendor
    }
  }

  async removeVendor(id: number) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID-${id} not found`);
    }
    await this.vendorRepository.delete(id);
    return {
      message: `Organization with this #${id} deleted successfully`,
      vendor: vendor,
    };
  }
}
