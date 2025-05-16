import { WebSocketServer, WebSocket } from "ws";
import { handleUserRegistration } from "./handlers/userHadler";
import { UserDataBase } from "../db/userDB";
import { handleCreatingRoom } from "./handlers/gameRoomHandler";
import { RoomDataBase } from "../db/roomDB";

const WS_PORT = 3000;

export enum CommandTypes {
  REGISTRATION = "reg",
  CREATE_ROOM = "create_room",
  UPDATE_ROOM = "update_room",
}

const wss = new WebSocketServer({ port: WS_PORT });
const userDB = new UserDataBase();
const roomDB = new RoomDataBase();

type ExtendedWebSocket = WebSocket & {
  player?: { name: string; index: string };
};

wss.on("connection", function connection(ws: WebSocket) {
  const socket = ws as ExtendedWebSocket;
  console.log(`WebSocket server on the ${WS_PORT} port!`);

  socket.on("error", console.error);

  socket.on("message", function message(data) {
    console.log("message", socket.player);
    const parsed = JSON.parse(data.toString());
    switch (parsed.type) {
      case CommandTypes.REGISTRATION: {
        const { response, index, name } = handleUserRegistration(
          JSON.parse(parsed.data),
          userDB
        );
        if (index && name) {
          socket.player = { index, name };
        }
        socket.send(JSON.stringify(response));
        break;
      }
    }
  });
  socket.on("close", function close() {
    if (socket.player) userDB.users[socket.player.name].isUserLoggedIn = false;
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
