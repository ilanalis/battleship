import { CommandTypes } from "..";
import { Room } from "../../db/roomDB";

interface SendRoomsResponse {
  type: CommandTypes.UPDATE_ROOM;
  data: string;
  id: 0;
}

interface RoomData {
  roomId: string;
  roomUsers: {
    name: string;
    index: string;
  }[];
}

export const HandleSendingRoomsList = (rooms: Room[]) => {
  const data: RoomData[] = rooms;
  const response: SendRoomsResponse = {
    type: CommandTypes.UPDATE_ROOM,
    data: JSON.stringify(data),
    id: 0,
  };
  return response;
};
