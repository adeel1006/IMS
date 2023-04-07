import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true})
  subCategory: string;

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
}
