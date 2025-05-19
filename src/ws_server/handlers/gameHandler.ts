import { CommandTypes } from "..";
import { GameTable } from "../../db/gameTable";

interface CreateGameResponse {
  type: CommandTypes.CREATE_GAME;
  data: string;
  id: 0;
}

interface Data {
  idGame: string;
  idPlayer: string;
}

export const handleCreatingGame = (
  gameTable: GameTable,
  playerIds: string[]
) => {
  const game = gameTable.createGame(playerIds);
  const responses: { [key: string]: CreateGameResponse } = {};

  playerIds.forEach((playerId) => {
    responses[playerId] = createResponse(game.idGame, playerId);
  });
  return responses;
};

const createResponse = (idGame: string, idPlayer: string) => {
  const data: Data = { idGame, idPlayer };
  const response: CreateGameResponse = {
    type: CommandTypes.CREATE_GAME,
    data: JSON.stringify(data),
    id: 0,
  };
  return response;
};
