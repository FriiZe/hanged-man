import {
  Column, CreateDateColumn, Entity, PrimaryColumn,
} from 'typeorm';

@Entity()
class User {
  @PrimaryColumn('uuid')
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
