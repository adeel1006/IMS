import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  action: string;

  @Column()
  @CreateDateColumn()
  submissionDate: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  complaintStatus() {
    //set the complaint status to false/pending before inserting to database
    this.status = false;
  }

  @ManyToOne(() => User, (user) => user.username, {eager: true})
  @JoinColumn()
  user: { id: number; username: string; email: string };
}
