import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { In, Repository } from 'typeorm';
import { Subcategory } from 'src/category/entities/subcategory.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  async createVendor(createVendorDto: CreateVendorDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: +createVendorDto.category },
    });
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    const subcategoryPromises = createVendorDto.subCategory.map(
      (subCategoryId) =>
        this.subcategoryRepository.findOne({ where: { id: subCategoryId } }),
    );
    const subcategories = await Promise.all(subcategoryPromises);

    const vendor = this.vendorRepository.create({
      vendorName: createVendorDto.vendorName,
      contactNumber: createVendorDto.contactNumber,
      category: category,
      subcategories: subcategories,
    });

    await this.vendorRepository.save(vendor);

    return {
      message: 'Vendor created successfully',
      vendor,
    };
  }
  async findAllVendor() {
    return await this.vendorRepository.find();
  }

  async findOneVendor(id: number) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new NotFoundException(`Vendor ${id} not found`);
    }
    return {
      message: `Vendor with ID #${id}`,
      vendor: vendor,
    };
  }

  async updateVendor(id: number, updateVendorDto: UpdateVendorDto) {
    const { vendorName, contactNumber, category, subCategory } =
      updateVendorDto;
    const vendor = await this.vendorRepository.findOneBy({ id: id });
    if (!vendor) {
      throw new NotFoundException('Vendor not found!');
    }

    const fetchCategory = await this.categoryRepository.findOne({
      where: { id: +category },
    });
    if (!category) {
      throw new NotFoundException(`Category not found`);
    }

    vendor.vendorName = vendorName;
    vendor.contactNumber = contactNumber;
    vendor.category = fetchCategory;

    if (subCategory?.length) {
      const subCategoriesEntities = await this.subcategoryRepository.find({
        where: { id: In(subCategory) },
      });
      vendor.subcategories = subCategoriesEntities;
    } else {
      vendor.subcategories = [];
    }
    await this.vendorRepository.save(vendor);
    return {
      message: `Vendor ${id} Updated successfully`,
      vendor: vendor,
    };
  }

  async removeVendor(id: number) {
    const vendor = await this.vendorRepository.findOneBy({ id });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID-${id} not found`);
    }
    await this.vendorRepository.delete(id);
    return {
      message: `Vendor with this #${id} deleted successfully`,
      vendor: vendor,
    };
  }

  async vendorCount() {
    const count = await this.vendorRepository.count();
    const title = 'Vendors';
    const icon = count <= 5 ? false : true;
    const tagline = `${count} new vendors added`;

    return {
      number: count,
      icon: icon,
      title: title,
      tagline: tagline,
    };
  }
}
