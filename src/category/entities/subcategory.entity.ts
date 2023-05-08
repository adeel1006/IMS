import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Request } from 'src/requests/entities/request.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';

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

  @ManyToOne(() => Category, (category) => category.subcategories)
  @JoinColumn()
  category: Category;

  @OneToMany(() => Request, request => request.subcategory)
  requests: Request[];

  @OneToMany(()=>Inventory, (inventory)=>inventory.subcategory)
  items: Inventory[];
}
