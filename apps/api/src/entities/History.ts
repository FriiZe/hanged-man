import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
class History {
  @PrimaryColumn()
  public playerId!: string;

  @PrimaryColumn()
  public gameId!: string;
}

export default History;
