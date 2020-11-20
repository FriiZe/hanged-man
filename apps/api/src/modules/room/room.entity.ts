import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class RoomEntity {
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
    default: true,
  })
  public isPublic!: boolean;

  @Column({
    nullable: false,
    type: 'jsonb',
  })
  public players!: string[];

  @Column({
    nullable: true,
  })
  public gameId?: string;
}
