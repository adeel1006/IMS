import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  @AfterInsert()
  logInsert() {
    console.log(`User inserted with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`User updated with id: ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`User removed with id: ${this.id}`);
  }
}
