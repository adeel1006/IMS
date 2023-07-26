import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @Column({ nullable: true })
  action: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Inventory, (item) => item.category, {
    cascade: true,
  })
  items: Inventory[];

  @OneToMany(() => Vendor, (vendor) => vendor.category, {
    cascade: true,
  })
  vendors: Vendor[];

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
    cascade: true,
    eager: true,
  })
  subcategories: Subcategory[];
}
