import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { User } from 'src/users/Models/entities/user.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createComplain(createComplaintDto: CreateComplaintDto) {
    const { userId, title, description } = createComplaintDto;
    //Getting userInfo on the base of id
    const userObj = await this.userRepository.findOne({
      select: ['id', 'username', 'email'],
      where: { id: userId },
    });

    if(!userObj){
      throw new NotFoundException(`User ${userId} does not exist`);
    }

    //destructing userInfo to avoid any sensitive information
    const { id, username, email } = userObj;

    const complaint = new Complaint();
    complaint.title = title;
    complaint.description = description;
    complaint.user = { id, username, email };
    await this.complaintRepository.save(complaint);

    return {
      message: 'Complaint created successfully',
      Complaint: complaint,
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

    const checkComplaintId = await this.complaintRepository.findOneBy({ id });
    if (!checkComplaintId) {
      throw new NotFoundException(`Complaint with ID-${id} not found`);
    }
    
    const complaint = new Complaint();
    complaint.title = updateComplaintDto.title;
    complaint.description = updateComplaintDto.description;
    complaint.status = updateComplaintDto.status;
    complaint.action = updateComplaintDto.action;

    await this.complaintRepository.update(id, complaint);

    return {
      message: `Complaint ${id} updated successfully`,
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
