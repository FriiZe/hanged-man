export interface GameDto {
  id: string;
  winner: string | null;
  isFinished: boolean;
  trials: number;
  partialWord: string;
}
