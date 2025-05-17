import { RoomTable } from "./roomTable";
import { UserTable } from "./userTable";

export const createDataBase = () => {
  const userTable = new UserTable();

  const roomTable = new RoomTable();
  return { userTable, roomTable };
};
