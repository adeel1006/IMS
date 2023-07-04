import { Subcategory } from 'src/category/entities/subcategory.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
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
  action: string;

  @Column({ nullable: true })
  status: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;


  @ManyToOne(() => User, user => user.requests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Subcategory, subcategory => subcategory.requests)
  subcategory: Subcategory;
}