import { generateUUID } from "../utils/generateUUID";

interface Game {
  idGame: string;
  playerIds: string[];
}

export class GameTable {
  games: { [key: string]: Game } = {};
  createGame(playerIds: string[]) {
    const idGame = generateUUID();
    const newGame = { idGame, playerIds };
    this.games[idGame] = newGame;
    return newGame;
  }
}
