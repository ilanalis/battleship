import { generateUUID } from "../utils/generateUUID";

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
    this.rooms[roomId] = newRoom;
    this.availableRooms[roomId] = newRoom;
    return newRoom;
  }

  addUserToRoom(roomId: string, user: RoomUser): boolean {
    const room = this.rooms[roomId];
    if (!room.roomUsers.some((u) => u.index === user.index)) {
      room.roomUsers.push(user);
      return true;
    }
    return false;
  }

  removeRoomFromAvailableList(roomId: string) {
    delete this.availableRooms[roomId];
  }

  findRoomsByUser(roomUser: RoomUser): Room[] {
    return Object.values(this.availableRooms).filter((room) =>
      room.roomUsers.some((user) => user.index === roomUser.index)
    );
  }
}
