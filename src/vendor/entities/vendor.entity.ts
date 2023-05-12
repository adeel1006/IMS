import { Subcategory } from 'src/category/entities/subcategory.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendorName: string;

  @Column()
  contactNumber: string;

  @Column()
  category: string;

  @Column({nullable: true})
  totalSpendings: number;

  @Column({ nullable: true })
  action: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(()=>Subcategory, (subcategories)=>subcategories.vendors, {eager: true})
  @JoinColumn()
  subcategories: Subcategory[];
}
