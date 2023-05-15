import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Organization } from 'src/organization/entities/organization.entity';
import { Complaint } from 'src/complaints/entities/complaint.entity';
import { Exclude } from 'class-transformer';
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  education: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;


  //RELATIONS
  @ManyToOne(() => Organization, (organization) => organization.users)
  @JoinColumn()
  organzation: Organization;

  @OneToMany(() => Complaint, (complaint) => complaint.description, {cascade: true})
  complaint: Complaint;



  //Orm Decorators functions
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  //LOGS
  @AfterInsert()
  logInsert() {
    console.log(`User inserted with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User updated with id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User removed with id: ${this.id}`);
  }
}
