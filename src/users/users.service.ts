import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail';
import { UpdateUserDto } from './dto/update-user.dto';
import cloudinary from 'cloudinary';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
  ) {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async createUser(createUserDto: CreateUserDto, currentUser) {
    const { userId } = currentUser;
    let organization;

    if (createUserDto.organization) {
      const organizationId = parseInt(createUserDto.organization, 10);
      organization = await this.organizationsRepository.findBy({
        id: organizationId,
      });
    } else {
      //extracts the organization on the base of admin id to link user to an organization employee
      const currentUserOrganization = await this.usersRepository.findBy({
        id: userId,
      });
      organization = currentUserOrganization[0]?.organization;
    }

    let cloudinaryURL;
    if (createUserDto.image) {
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        createUserDto.image,
      );
      cloudinaryURL = cloudinaryResponse.secure_url;
    }

    const user = await this.usersRepository.create({
      ...createUserDto,
      image: cloudinaryURL,
      organization: organization,
    });

    await user.save();

    const EmailArguments = {
      send_to: createUserDto.email,
      email_subject: 'Credentials for IMS',
      email_body: `<p>Your Email is : ${createUserDto.email} & password is : ${createUserDto.password}</p>`,
    };
    //send OTP TO EMAIL
    await sendEmail(EmailArguments);

    delete user.password;
    return user;
    return true;
  }

  async getAllAdminUsers() {
    return this.usersRepository.find({ where: { role: 'ADMIN' } });
  }

  async getAllEmployees() {
    return this.usersRepository.find({ where: { role: 'EMPLOYEE' } });
  }

  async findAllUsers() {
    return this.usersRepository.find();
  }

  async findUser(id: number) {
    const user = await this.usersRepository.findBy({ id: id });
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Update the user properties
    user.username = updateUserDto.username;
    user.email = updateUserDto.email;
    user.age = updateUserDto.age;
    user.contact = updateUserDto.contact;
    user.designation = updateUserDto.designation;
    user.department = updateUserDto.department;
    user.companyExperience = updateUserDto.companyExperience;
    user.totalExperience = updateUserDto.totalExperience;
    user.education = updateUserDto.education;

    // Upload the new image to Cloudinary
    if (updateUserDto.image) {
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        updateUserDto.image,
      );
      const cloudinaryURL = cloudinaryResponse.secure_url;
      user.image = cloudinaryURL;
    }
    return this.usersRepository.save(user);
  }

  async removeUser(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID-${id} not found`);
    }
    await this.usersRepository.delete(id);
    return {
      user: user,
    };
  }

  async findUserByEmail(email: string) {
    return await User.findOne({
      where: {
        email: email,
      },
    });
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User "${email}" not found`);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersRepository.update(user.id, { otp });
    //Email Argument object
    const EmailArguments = {
      send_to: email,
      email_subject: 'Reset Password OTP',
      email_body: `<p>Your one time password (OTP) is ${otp} </p>`,
    };
    //send OTP TO EMAIL
    await sendEmail(EmailArguments);

    // console.log(`OTP sent to this email "${user.email}" : OTP-${otp}`);
    return otp;
  }

  async resetPassword(email: string, newPassword: string, otp: string) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException(`User "${email}" not found`);
    }
    if (user.otp !== otp) {
      throw new NotAcceptableException('Invalid OTP');
    }
    console.log(email, newPassword, otp);
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.update(user.id, {
      password: hashPassword,
      otp: null,
    });

    return {
      message: 'Password Reset Successful',
      userId: user.id,
      email: user.email,
    };
  }

  async getAdminCounts() {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    const count = await queryBuilder
      .where('user.role = :role', { role: 'ADMIN' })
      .getCount();

    const title = 'Admins';
    const icon = count <= 10 ? false : true;
    const tagline = `${count} new admins added this month`;

    return {
      number: count,
      icon: icon,
      title: title,
      tagline: tagline,
    };
  }

  async countEmployeesNumbers() {
    const count = await this.usersRepository.count({
      where: { role: 'EMPLOYEE' },
    });

    const title = 'Employees';
    const icon = count <= 10 ? false : true;
    const tagline = `${count} new employees added `;

    return {
      number: count,
      icon: icon,
      title: title,
      tagline: tagline,
    };
  }

  async getAdminsByMonth() {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    const adminsByMonth = await queryBuilder
      .select('EXTRACT(MONTH FROM user.createdAt)', 'month')
      .addSelect('COUNT(*)', 'number')
      .where('user.role = :role', { role: 'ADMIN' })
      .groupBy('month')
      .getRawMany();

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const result = months.map((month, index) => {
      const adminCount = adminsByMonth.find(
        (admin) => admin.month === (index + 1).toString(),
      );
      return { month: month, number: adminCount ? adminCount.number : 0 };
    });

    return result;
  }
}
