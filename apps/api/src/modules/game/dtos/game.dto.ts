export interface GameDto {
  id: string;
  winner: string | null;
  currentPlayer: string;
  isFinished: boolean;
  trials: number;
  partialWord: string;
}
