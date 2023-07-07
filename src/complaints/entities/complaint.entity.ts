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
  suggestion: string;

  @Column({ nullable: true })
  status: string;

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

  @ManyToOne(() => User, (user) => user.username, { eager: true })
  @JoinColumn()
  user: { id: number; username: string; email: string; role: string };
}
