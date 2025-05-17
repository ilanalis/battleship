import { RoomTable } from "../../db/roomTable";

export const handleCreatingRoom = (roomTable: RoomTable): void => {
  roomTable.createRoom();
};

export const getAvailableRooms = (roomTable: RoomTable) => {
  return Object.values(roomTable.availableRooms);
};
