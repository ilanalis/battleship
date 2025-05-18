import { generateUUID } from "../utils/generateUUID";

const MAX_COUNT_OF_PLAYERS = 2;

export interface RoomUser {
  name: string;
  index: string;
}

export interface Room {
  roomId: string;
  roomUsers: RoomUser[];
}

export class RoomTable {
  rooms: { [key: string]: Room } = {};
  availableRooms: { [key: string]: Room } = {};

  getRoom(id: string): Room | undefined {
    return this.rooms[id];
  }

  createRoom(): Room {
    const roomId = generateUUID();
    const newRoom = { roomId, roomUsers: [] };
    this.rooms[roomId] = { ...newRoom, roomUsers: [] };
    this.availableRooms[roomId] = { ...newRoom, roomUsers: [] };
    return newRoom;
  }

  addUserToRoom(roomId: string, user: RoomUser) {
    const room = this.rooms[roomId];
    if (room.roomUsers[0]?.index === user.index) return;
    if (room.roomUsers.length < MAX_COUNT_OF_PLAYERS) {
      room.roomUsers.push(user);
    }
    const availableRoom = this.availableRooms[roomId];
    availableRoom.roomUsers.push(user);
    if (availableRoom.roomUsers.length === MAX_COUNT_OF_PLAYERS) {
      delete this.availableRooms[roomId];
    }
  }
}
