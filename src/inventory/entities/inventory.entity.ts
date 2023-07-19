import { Category } from 'src/category/entities/category.entity';
import { Subcategory } from 'src/category/entities/subcategory.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
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

  @ManyToOne(() => Category, (category) => category.items, { eager: true })
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.items, {
    eager: true,
  })
  @JoinColumn({ name: 'subcategoryId' })
  subcategory: Subcategory;

  @ManyToOne(() => Vendor, (vendor) => vendor.items, { eager: true })
  vendor: Vendor;
}
