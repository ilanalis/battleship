interface Game {}

export class GameTable {
  games: { [key: string]: Game } = {};
  createGame() {}
}
