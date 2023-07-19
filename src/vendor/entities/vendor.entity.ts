import { Category } from 'src/category/entities/category.entity';
import { Subcategory } from 'src/category/entities/subcategory.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendorName: string;

  @Column()
  contactNumber: string;

  @Column({ nullable: true })
  totalSpendings: number;

  @Column({ nullable: true })
  action: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Inventory, (item) => item.vendor)
  items: Inventory[];

  @ManyToOne(() => Category, (category) => category.vendors, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany(() => Subcategory, { eager: true })
  @JoinTable()
  subcategories: Subcategory[];
}
