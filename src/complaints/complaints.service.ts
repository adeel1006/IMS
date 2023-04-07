import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
  ) {}
  async createComplain(createComplaintDto: CreateComplaintDto) {
    const newComplaint = await this.complaintRepository.create(
      createComplaintDto,
    );
    const complaintObj = await this.complaintRepository.save(newComplaint);
    return {
      message: 'Complaint created successfully',
      Complaint: complaintObj,
    };
  }

  async findAllComplaints() {
    return await this.complaintRepository.find();
  }

  async findOneComplaint(id: number) {
    const complaint = await this.complaintRepository.findOneBy({ id });
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID-${id} not found`);
    }
    return {
      complaint: complaint,
    };
  }

  async updateComplaint(id: number, updateComplaintDto: UpdateComplaintDto) {
    const complaint = new Complaint();
    complaint.title = updateComplaintDto.title;
    complaint.description = updateComplaintDto.description;
    complaint.status = updateComplaintDto.status;
    complaint.action = updateComplaintDto.action;

    const checkComplaintId = await this.complaintRepository.findOneBy({ id });
    if (!checkComplaintId) {
      throw new NotFoundException(`Organization with ID-${id} not found`);
    }

    const updateProcess = await this.complaintRepository.update(id, complaint);

    return {
      message: 'Complaint updated successfully',
      complaint: complaint,
    };
  }

  async removeComplaint(id: number) {
    const complaint = await this.complaintRepository.findOneBy({ id });
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID-${id} not found`);
    }
    await this.complaintRepository.delete(id);
    return {
      complaint: complaint,
    };
  }
}
