import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from './entities/complaint.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async createComplain(currentUser, createComplaintDto: CreateComplaintDto) {
    const { title, description, suggestion } = createComplaintDto;
    //Getting userInfo on the base of id
    const userObj = await this.userRepository.findOne({
      select: ['id', 'username', 'email', 'role'],
      where: { id: currentUser.userId },
    });

    if (!userObj) {
      throw new NotFoundException(`User ${currentUser} does not exist`);
    }

    //destructing userInfo to avoid any sensitive information
    const { id, username, email, role } = userObj;

    const complaint = new Complaint();
    complaint.title = title;
    complaint.description = description;
    complaint.suggestion = suggestion;
    complaint.status = 'pending';
    complaint.user = { id, username, email, role };
    await this.complaintRepository.save(complaint);

    return {
      message: 'Complaint created successfully',
      Complaint: complaint,
    };
  }
  async findAllComplaints() {
    return await this.complaintRepository.find();
  }

  async getComplaintsStatus() {
    const complaints = await this.complaintRepository.find();
    return complaints.map(({ user, status, ...complaint }) => ({
      status: status ? 'Resolved' : 'Pending',
      ...complaint,
    }));
  }

  async findUserComplaints(currentUser) {
    const { userId } = currentUser;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const complaints = await this.complaintRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return {
      message: `Requests for user ${userId}`,
      complaints: complaints,
    };
  }

  async findEmployeesComplaints() {
    const empComplaints = await this.complaintRepository.find({
      where: { user: { role: 'EMPLOYEE' } },
      order: { createdAt: 'DESC' },
    });

    return empComplaints;
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

  async findEmployeeComplaintsCountByMonth() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const queryBuilder =
      this.complaintRepository.createQueryBuilder('complaint');

    const empComplaintsByMonthCount = await queryBuilder
      .select('EXTRACT(MONTH FROM complaint.createdAt)', 'month')
      .addSelect('COUNT(*)', 'number')
      .innerJoin('complaint.user', 'user')
      .where('user.role = :role', { role: 'EMPLOYEE' })
      .andWhere('EXTRACT(YEAR FROM complaint.createdAt) = :year', {
        year: currentYear,
      }) // Filter by current year
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const result = empComplaintsByMonthCount.map((item) => ({
      name: monthNames[item.month - 1],
      number: parseInt(item.number, 10),
    }));

    return result;
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

  async getPendingComplaintCount() {
    const count = await this.complaintRepository.count({
      where: { status: 'pending' },
    });
    const title = 'Complaints';
    const icon = count <= 10 ? false : true;
    const tagline = `${count} Pending complaints`;

    return {
      number: count,
      icon: icon,
      title: title,
      tagline: tagline,
    };
  }

  async countResolvedComplaints() {
    const count = await this.complaintRepository.count({
      where: { status: 'resolved' },
    });

    const title = 'Complaints';
    const icon = count <= 10 ? false : true;
    const tagline = `${count} Resolved complaints`;

    return {
      number: count,
      icon: icon,
      title: title,
      tagline: tagline,
    };
  }
}
