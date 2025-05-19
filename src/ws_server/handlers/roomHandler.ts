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
): { isRoomFull: boolean; playerIds: string[] } => {
  const room = roomTable.rooms[roomId];
  if (room.roomUsers.length < MAX_COUNT_OF_PLAYERS) {
    const wasUserAdded = roomTable.addUserToRoom(roomId, user);
    if (room.roomUsers.length === MAX_COUNT_OF_PLAYERS) {
      const usersRooms = [
        ...roomTable.findRoomsByUser(
          roomTable.availableRooms[roomId].roomUsers[0]
        ),
        ...roomTable.findRoomsByUser(
          roomTable.availableRooms[roomId].roomUsers[1]
        ),
      ];
      usersRooms.forEach((room) => {
        roomTable.removeRoomFromAvailableList(room.roomId);
      });

      roomTable.removeRoomFromAvailableList(roomId);
      console.log(`user ${user.name} was added to room with id:${roomId}`);
      return {
        isRoomFull: true,
        playerIds: Object.values(room.roomUsers).map((user) => user.index),
      };
    }
    if (wasUserAdded) {
      console.log(`user ${user.name} was added to room with id:${roomId}`);
    } else {
      console.log(`User ${user.name} is already in room with id ${roomId}`);
    }

    return {
      isRoomFull: false,
      playerIds: Object.values(room.roomUsers).map((user) => user.index),
    };
  }
  console.log(`Cannot add user ${user.name} to room ${roomId}: room is full.`);
  return {
    isRoomFull: false,
    playerIds: Object.values(room.roomUsers).map((user) => user.index),
  };
};
