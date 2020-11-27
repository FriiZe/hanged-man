export interface GameDto {
  id: string;
  winner?: string;
  isFinished: boolean;
  trials: number;
  partialWord: string;
}
