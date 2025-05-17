import { WebSocketServer, WebSocket } from "ws";
import { handleUserRegistration } from "./handlers/userHadler";
import {
  getAvailableRooms,
  handleCreatingRoom,
} from "./handlers/gameRoomHandler";
import { HandleSendingRoomsList } from "./handlers/ responseForAll";
import { createDataBase } from "../db/createDB";

const WS_PORT = 3000;

export enum CommandTypes {
  REGISTRATION = "reg",
  CREATE_ROOM = "create_room",
  UPDATE_ROOM = "update_room",
}

const { userTable, roomTable } = createDataBase();

const wss = new WebSocketServer({ port: WS_PORT });
type ExtendedWebSocket = WebSocket & {
  player?: { name: string; index: string };
};

wss.on("connection", function connection(ws: WebSocket) {
  const socket = ws as ExtendedWebSocket;
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
        if (socket.player) {
          handleCreatingRoom(roomTable);
          const response = HandleSendingRoomsList(getAvailableRooms(roomTable));
          socket.send(JSON.stringify(response));
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
