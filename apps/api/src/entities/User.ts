import {
  Column, CreateDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  public username!: string;

  @Column({
    nullable: false,
  })
  public password!: string;

  @CreateDateColumn()
  public createdAt!: Date;
}

export default User;
