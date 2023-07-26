import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Request } from 'src/requests/entities/request.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  //category relation
  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: Category;

  //request relation
  @OneToMany(() => Request, (request) => request.subcategory)
  requests: Request[];

  //items relation
  @OneToMany(() => Inventory, (inventory) => inventory.subcategory)
  items: Inventory[];

  @ManyToMany(() => Vendor, (vendor) => vendor.subcategories)
  vendors: Vendor[];
}
