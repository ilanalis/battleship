import { RoomDataBase } from "../../db/roomDB";

export const handleCreatingRoom = (
  db: RoomDataBase,
  player: { name: string; index: string }
): void => {
  db.createRoom([player]);
};
