import { RoomTable, RoomUser } from "../../db/roomTable";
const MAX_COUNT_OF_PLAYERS = 2;

export const handleCreatingRoom = (roomTable: RoomTable): void => {
  const room = roomTable.createRoom();
  console.log(`Room with id: ${room.roomId} has been created`);
};

export const getAvailableRooms = (roomTable: RoomTable) => {
  return Object.values(roomTable.availableRooms);
};

export const tryAddUserToRoom = (
  roomTable: RoomTable,
  roomId: string,
  user: RoomUser
): boolean => {
  const room = roomTable.rooms[roomId];
  if (room.roomUsers.length < MAX_COUNT_OF_PLAYERS) {
    const wasUserAdded = roomTable.addUserToRoom(roomId, user);
    if (room.roomUsers.length === MAX_COUNT_OF_PLAYERS) {
      roomTable.removeRoomFromAvailableList(roomId);
      console.log(`user ${user.name} was added to room with id:${roomId}`);

      return true;
    }
    if (wasUserAdded) {
      console.log(`user ${user.name} was added to room with id:${roomId}`);
    } else {
      console.log(`User ${user.name} is already in room with id ${roomId}`);
    }

    return false;
  }
  console.log(`Cannot add user ${user.name} to room ${roomId}: room is full.`);
  return false;
};
