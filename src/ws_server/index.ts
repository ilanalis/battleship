import { WebSocketServer, WebSocket } from "ws";
import { handleUserRegistration } from "./handlers/userHadler";
import {
  getAvailableRooms,
  handleCreatingRoom,
  tryAddUserToRoom,
} from "./handlers/roomHandler";
import { HandleSendingRoomsList } from "./handlers/ responseForAll";
import { createDataBase } from "../db/createDB";

const WS_PORT = 3000;

const { userTable, roomTable } = createDataBase();

export enum CommandTypes {
  REGISTRATION = "reg",
  CREATE_ROOM = "create_room",
  UPDATE_ROOM = "update_room",
  ADD_USER_TO_ROOM = "add_user_to_room",
}
type ExtendedWebSocket = WebSocket & {
  player?: { name: string; index: string };
};
let clients: ExtendedWebSocket[] = [];

const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", function connection(ws: WebSocket) {
  const socket = ws as ExtendedWebSocket;
  clients.push(socket);
  console.log(`WebSocket server on the ${WS_PORT} port!`);

  socket.on("error", console.error);

  socket.on("message", function message(data) {
    const parsed = JSON.parse(data.toString());
    switch (parsed.type) {
      case CommandTypes.REGISTRATION: {
        const { response, index, name } = handleUserRegistration(
          JSON.parse(parsed.data),
          userTable
        );
        if (index && name) {
          socket.player = { index, name };
        }
        socket.send(JSON.stringify(response));
        const availableRoomsMessage = HandleSendingRoomsList(
          getAvailableRooms(roomTable)
        );
        socket.send(JSON.stringify(availableRoomsMessage));

        break;
      }

      case CommandTypes.CREATE_ROOM: {
        if (socket.player?.index) {
          handleCreatingRoom(roomTable);
          broadcastUpdateRooms();
        }
        break;
      }

      case CommandTypes.ADD_USER_TO_ROOM: {
        const indexRoom = JSON.parse(parsed.data.toString()).indexRoom;
        if (socket.player) {
          const isRoomFull = tryAddUserToRoom(
            roomTable,
            indexRoom,
            socket.player
          );
          broadcastUpdateRooms();
          if (isRoomFull) {
            ///create game
          }
        }
        break;
      }
    }
  });
  socket.on("close", function close() {
    if (socket.player)
      userTable.users[socket.player.name].isUserLoggedIn = false;
  });
});

function shutdown() {
  console.log("\nShutting down WebSocket server...");

  wss.clients.forEach((client) => {
    client.close(1001, "Server shutting down");
  });

  wss.close(() => {
    console.log("WebSocket server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);

function broadcastUpdateRooms() {
  const message = HandleSendingRoomsList(getAvailableRooms(roomTable));

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
