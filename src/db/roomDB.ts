import { generateUUID } from "../utils/generateUUID";
import { User } from "./userDB";

export interface Room {
  roomId: string;
  roomUsers: { name: string; index: string }[];
}

export class RoomDataBase {
  rooms: { [key: string]: Room } = {};
  availableRooms: Room[] = [];

  getRoom(id: string): Room | undefined {
    return this.rooms[id];
  }

  createRoom(roomUsers: { name: string; index: string }[]): Room {
    const roomId = generateUUID();
    const newRoom = { roomId, roomUsers };
    this.rooms[roomId] = newRoom;
    this.availableRooms.push(newRoom);
    return newRoom;
  }
}
