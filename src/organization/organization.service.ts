import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import cloudinary from 'cloudinary';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {
    // configuration of cloudinary
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async createOrganization(
    createOrganizationDto: CreateOrganizationDto,
    logo: any,
  ) {
    const fs = require('fs');
    const { extname } = require('path');
    const fileExtName = extname(logo.originalname);
    const fileName = `${new Date().getTime().toString()}${fileExtName}`;
    const folderPath = './temp';

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    const filePath = `${folderPath}/${fileName}`;
    const fileStream = fs.createWriteStream(filePath);
    fileStream.write(logo.buffer);
    fileStream.end();

    // Upload to cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.upload(filePath);
    fs.unlinkSync(filePath);

    const organization = this.organizationRepository.create({
      ...createOrganizationDto,
      logo: cloudinaryResponse.secure_url,
    });

    return await this.organizationRepository.save(organization);
  }

  async findAllOrganizations() {
    return await this.organizationRepository.find();
  }

  async findOneOrganization(id: number) {
    const org = await this.organizationRepository.findOneBy({ id });
    if (!org) {
      throw new NotFoundException(`Organization with ID-${id} not found`);
    }

    return {
      message: `Organization with this #${id}`,
      org: org,
    };
  }

  async updateOrganization(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ) {
    const org = new Organization();
    if (!org) {
      throw new NotFoundException(`Organization with ID-${id} not found`);
    }

    org.name = updateOrganizationDto.name;
    org.email = updateOrganizationDto.email;
    org.bio = updateOrganizationDto.bio;
    org.address = updateOrganizationDto.address;
    org.city = updateOrganizationDto.city;
    org.country = updateOrganizationDto.country;
    org.zipCode = updateOrganizationDto.zipCode;
    org.representativeName = updateOrganizationDto.representativeName;
    org.representativeContact = updateOrganizationDto.representativeContact;

    const checkOrgId = await this.organizationRepository.findOneBy({ id });
    if (!checkOrgId) {
      throw new NotFoundException(`Organization with ID-${id} not found`);
    }

    await this.organizationRepository.update(id, org);
    return {
      message: `Organization ${id} updated Successfully`,
      org: org,
    };
  }

  async removeOrganization(id: number) {
    const org = await this.organizationRepository.findOneBy({ id });
    if (!org) {
      throw new NotFoundException(`Organization with ID-${id} not found`);
    }
    await this.organizationRepository.delete(id);
    return {
      message: `Organization with this #${id} deleted successfully`,
      org: org,
    };
  }

  async getCurrentMonthOrganizationsCount() {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const count = await this.organizationRepository
      .createQueryBuilder('organization')
      .where('organization.createdAt BETWEEN :start AND :end', {
        start: startOfMonth,
        end: endOfMonth,
      })
      .getCount();

    return count;
  }
}
