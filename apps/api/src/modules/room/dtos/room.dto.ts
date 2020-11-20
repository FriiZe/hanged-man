export interface RoomDto {
  id: string;
  name: string;
  code?: string;
  isPublic: boolean;
  players: string[];
  gameId?: string;
}
