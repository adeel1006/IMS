import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}
  async createOrganization(createOrganizationDto: CreateOrganizationDto) {
    const org = await this.organizationRepository.create(createOrganizationDto);
    await this.organizationRepository.save(org);
    return 'New Organization Added successfully';
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

    org.logoUrl = updateOrganizationDto.logoUrl;
    org.name = updateOrganizationDto.name;
    org.email = updateOrganizationDto.email;
    org.bio = updateOrganizationDto.bio;
    org.address = updateOrganizationDto.address;
    org.city = updateOrganizationDto.city;
    org.country = updateOrganizationDto.country;
    org.zipCode = updateOrganizationDto.zipCode;
    org.representativeName = updateOrganizationDto.representativeName;
    org.representativeContact = updateOrganizationDto.representativeContact;

    const updateProcess = await this.organizationRepository.update(id, org);
    return {
      message: 'Updated Organization Successfully',
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
}
