import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('games')
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    nullable: true,
  })
  public winner?: string;

  @Column({
    default: false,
    nullable: false,
  })
  public isFinished!: boolean;

  @Column({
    nullable: false,
  })
  public trials!: number;

  @Column({
    nullable: false,
  })
  public partialWord!: string;

  @Column({
    nullable: false,
  })
  public finalWord!: string;
}
