import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
class Player {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column({
    nullable: false,
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
  })
  public userId!: string;
}

export default Player;
