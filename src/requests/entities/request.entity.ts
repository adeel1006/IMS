import { Subcategory } from 'src/category/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  itemName: string;

  @Column()
  requestType: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  action: string;

  @Column({ nullable: true })
  status: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.requests, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.requests, {
    cascade: true,
    eager: true,
  })
  subcategory: Subcategory;
}
