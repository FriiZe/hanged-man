export interface RoomDto {
  id: string;
  name: string;
  isPublic: boolean;
  players: string[];
  owner: string;
  gameId: string | null;
}
