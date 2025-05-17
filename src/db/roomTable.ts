import { generateUUID } from "../utils/generateUUID";
import { User } from "./userTable";

const MAX_COUNT_OF_PLAYERS = 2;

interface roomUser {
  name: string;
  index: string;
}

export interface Room {
  roomId: string;
  roomUsers: roomUser[];
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
    this.rooms[roomId] = newRoom;
    this.availableRooms[roomId] = newRoom;
    return newRoom;
  }

  addUserToRoom(roomId: string, user: roomUser) {
    this.rooms[roomId].roomUsers.push(user);
    const currentRoomUsers = this.availableRooms[roomId].roomUsers;
    currentRoomUsers.push(user);
    if (currentRoomUsers.length === 2) {
      delete this.availableRooms[roomId];
    }
  }
}
