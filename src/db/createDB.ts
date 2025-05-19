import { GameTable } from "./gameTable";
import { RoomTable } from "./roomTable";
import { UserTable } from "./userTable";

export const createDataBase = () => {
  const userTable = new UserTable();
  const roomTable = new RoomTable();
  const gameTable = new GameTable();
  return { userTable, roomTable, gameTable };
};
