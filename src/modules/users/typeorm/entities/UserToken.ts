/* eslint-disable indent */
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_tokens')
class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  @Generated('uuid')
  token: string;

  @Column('text')
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserToken;
