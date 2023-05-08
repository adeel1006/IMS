import { Subcategory } from 'src/category/entities/subcategory.entity';
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

  // @OneToMany(()=>Category, (category)=>category.requestType, {cascade: true})
  // category: Category

  // @OneToMany(()=>Subcategory, (subcategory)=>subcategory.name, {cascade:true, eager:true})
  // @JoinColumn()
  // subCategory: Subcategory

  @ManyToOne(() => Subcategory, subcategory => subcategory.requests)
  subcategory: Subcategory;
}