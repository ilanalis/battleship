import { RoomTable, RoomUser } from "../../db/roomTable";

export const handleCreatingRoom = (roomTable: RoomTable): void => {
  roomTable.createRoom();
};

export const getAvailableRooms = (roomTable: RoomTable) => {
  return Object.values(roomTable.availableRooms);
};

export const handleAddingUserToRoom = (
  roomTable: RoomTable,
  roomId: string,
  user: RoomUser
) => {
  roomTable.addUserToRoom(roomId, user);
};
