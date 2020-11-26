export interface RoomDto {
  id: string;
  name: string;
  isPublic: boolean;
  players: string[];
  gameId?: string;
}
