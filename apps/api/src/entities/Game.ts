import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Game {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    nullable: true,
  })
  public winner?: string;

  @Column({
    default: false,
  })
  public finished!: boolean;

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

export default Game;
