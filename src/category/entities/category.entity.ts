import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryName: string;

  @Column({nullable: true})
  subCategoryName: string;

  @Column({nullable: true})
  action: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(()=> Category, (category)=>category.subCategoryName, {onDelete: 'CASCADE'})
  // @JoinColumn()
  // parent: Category;

  // @OneToMany(()=>Category, (category)=> category.parent, {cascade: true})
  // subCategoryName: Category[]
}
