import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Room {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    nullable: false,
  })
  public name!: string;

  @Column({
    nullable: true,
  })
  public code?: string;

  @Column({
    nullable: false,
    array: true,
  })
  public players!: string;

  @Column({
    nullable: true,
  })
  public gameId?: string;
}

export default Room;
