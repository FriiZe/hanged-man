import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('players')
export class PlayerEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  public displayName!: string;

  @Column({
    nullable: false,
    default: 0,
  })
  public gamesWon!: number;

  @Column({
    nullable: false,
    default: false,
  })
  public isInGame!: boolean;

  @Column({
    nullable: false,
    unique: true,
  })
  public userId!: string;
}
