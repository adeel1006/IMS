import { Subcategory } from 'src/category/entities/subcategory.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemName: string;

  @Column()
  serialNumber: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(()=> Subcategory, (subcategory)=>subcategory.items, {eager: true})
  @JoinColumn({name:'subcategoryId'})
  subcategory: Subcategory;

}
