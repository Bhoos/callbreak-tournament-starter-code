const { exit } = require("process");
const { readFile } = require("fs");
const path = require("path");

const scriptName = path.basename(__filename);

async function readFileData(filePath) {
  return new Promise((resolve, reject) => {
    readFile(filePath.toString(), "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(JSON.parse(data));
    });
  });
}

async function stateToApiParser() {
  const argsPassed = process.argv.slice(2);

  if (argsPassed.length !== 4) {
    return `Usage: node ${scriptName} file round hand turn 
    round:\tranges from 1 to 5
    hand:\tranges from 0 to 13 (0 stands for bidding phase)
    turn:\tranges from 0 to 3 (turn is in the respect to the playerIds)
    \t\t(turn 0 means turn of bot-1 when playerIds=['bot-1','bot-2','bot-3','bot-4'])`;
  }

  filePath = argsPassed[0];
  roundNumber = parseInt(argsPassed[1]);
  hand = parseInt(argsPassed[2]);
  turn = parseInt(argsPassed[3]);

  // bid cards in data is always in respect to player ID
  // cards in data is always in respect to player ID
  // Score in data in always in respect to player ID

  // to make iterations easier
  roundNumber = roundNumber - 1;
  hand = hand - 1;

  // async function to read file data .
  // await function to assign value.

  const gameHistoryData = await readFileData(filePath).catch((err) => {
    console.log("Error : Cannot find the file");
    console.log(
      `Run node ${scriptName} --help for instructions on how to run the script`
    );
    exit();
  });

  // assign id to players with same name.
  for (let element_idx = 0; element_idx < 3; element_idx++) {
    for (
      let compare_element_idx = element_idx + 1;
      compare_element_idx < 4;
      compare_element_idx++
    ) {
      if (
        gameHistoryData.players[element_idx] ==
        gameHistoryData.players[compare_element_idx]
      ) {
        gameHistoryData.players[element_idx] =
          gameHistoryData.players[element_idx] + " 1";
        gameHistoryData.players[compare_element_idx] =
          gameHistoryData.players[compare_element_idx] + " 2";
      }
    }
  }

  const playerIds = gameHistoryData.players;
  const totalPoints = [0, 0, 0, 0]; // initial totalPoints of the match.

  // USER INPUT VALIDATIONS
  if (roundNumber > gameHistoryData.rounds.length - 1 || roundNumber < 0)
    throw new Error(
      "Error: Invalid round number. Data for the given round number does not exist \n"
    );
  if (
    hand > gameHistoryData.rounds[roundNumber].actions.length - 1 ||
    hand < -1
  )
    throw new Error(
      "Error: Invalid hand number. Data for the given hand number does not exist"
    );

  if (turn < 0 || turn > 3) {
    throw new Error(
      "Error: Invalid turn number.Data for the given turn number does not exist"
    );
  }
  if (hand > 0) {
    if (
      gameHistoryData.rounds[roundNumber].actions[hand].cards[turn] == null ||
      turn < 0
    ) {
      throw new Error("Error: Invalid turn number. Data does not exist.");
    }
  }

  if (hand == -1) {
    return `${JSON.stringify(
      bidBody(gameHistoryData, roundNumber, turn, playerIds, totalPoints),
      null,
      2
    )}`;
  } else {
    return `${JSON.stringify(
      playBody(
        gameHistoryData,
        roundNumber,
        hand,
        turn,
        playerIds,
        totalPoints
      ),
      null,
      2
    )}`;
  }
}

function bidBody(gameHistoryData, roundNumber, turn, playerIds, totalPoints) {
  const rounds = gameHistoryData.rounds;

  if (roundNumber > 0) {
    totalPoints = rounds[roundNumber - 1].scores;
  }

  let player = (rounds[roundNumber].dealer + 1) % 4; // player who starts the bidding turn .

  let bidState = {
    playerId: null,
    playerIds: playerIds,
    cards: [],
    context: {
      round: parseInt(roundNumber) + 1,
      players: {
        [playerIds[0]]: {
          totalPoints: totalPoints[0],
          bid: 0,
          won: 0,
        },
        [playerIds[1]]: {
          totalPoints: totalPoints[1],
          bid: 0,
          won: 0,
        },
        [playerIds[2]]: {
          totalPoints: totalPoints[2],
          bid: 0,
          won: 0,
        },
        [playerIds[3]]: {
          totalPoints: totalPoints[3],
          bid: 0,
          won: 0,
        },
      },
    },
  };

  for (var turnNum = 0; turnNum < 4; turnNum++) {
    if (turnNum == 0) {
      bidState.playerId = playerIds[(player + turnNum) % 4];
      bidState.cards = rounds[roundNumber].cards[(player + turnNum) % 4];
    } else {
      bidState.playerId = playerIds[(player + turnNum) % 4];
      bidState.cards = rounds[roundNumber].cards[(player + turnNum) % 4];
      bidState.context.players[playerIds[(player + turnNum - 1) % 4]].bid =
        rounds[roundNumber].bids[(player + turnNum - 1) % 4];
    }
    if (turn === (player + turnNum) % 4) {
      return bidState;
    }
  }
}

function playBody(
  gameHistoryData,
  roundNumber,
  hand,
  turn,
  playerIds,
  totalPoints
) {
  const rounds = gameHistoryData.rounds;
  const gamesWon = [0, 0, 0, 0];

  if (roundNumber > 0) {
    totalPoints = rounds[roundNumber - 1].scores;
  }
  let playState = {
    playerId: null,
    playerIds: playerIds,
    cards: [],
    played: [],
    history: [],
    context: {
      round: parseInt(roundNumber) + 1,
      players: {
        [playerIds[0]]: {
          totalPoints: totalPoints[0],
          bid: 0,
          won: 0,
        },
        [playerIds[1]]: {
          totalPoints: totalPoints[1],
          bid: 0,
          won: 0,
        },
        [playerIds[2]]: {
          totalPoints: totalPoints[2],
          bid: 0,
          won: 0,
        },
        [playerIds[3]]: {
          totalPoints: totalPoints[3],
          bid: 0,
          won: 0,
        },
      },
    },
  };

  // assign bids.
  for (let idx = 0; idx < 4; idx++) {
    playState.context.players[playerIds[idx]].bid =
      rounds[roundNumber].bids[idx];
  }

  // calculate  won .
  for (let actionsLoop = 0; actionsLoop < hand; actionsLoop++) {
    gamesWon[rounds[roundNumber].actions[actionsLoop].ended] =
      gamesWon[rounds[roundNumber].actions[actionsLoop].ended] + 1;
  }

  // assign  won ..
  playState.context.players[playerIds[0]].won = gamesWon[0];
  playState.context.players[playerIds[1]].won = gamesWon[1];
  playState.context.players[playerIds[2]].won = gamesWon[2];
  playState.context.players[playerIds[3]].won = gamesWon[3];

  // calculate history .
  let history = [];

  for (let historyLoop = 0; historyLoop < hand; historyLoop++) {
    history.push([
      rounds[roundNumber].actions[historyLoop].started,
      rounds[roundNumber].actions[historyLoop].cards,
      rounds[roundNumber].actions[historyLoop].ended,
    ]);
  }

  playState.history = history;

  // filter cards available

  let availableCards = gameHistoryData.rounds[roundNumber].cards;

  for (let cardsLoop = 0; cardsLoop < hand; cardsLoop++) {
    let currentcards =
      gameHistoryData.rounds[roundNumber].actions[cardsLoop].cards;
    let playerIdx =
      gameHistoryData.rounds[roundNumber].actions[cardsLoop].started;
    for (let turnLoop = 0; turnLoop < 4; turnLoop++) {
      availableCards[(playerIdx + turnLoop) % 4] = availableCards[
        (playerIdx + turnLoop) % 4
      ].filter((card) => card != currentcards[turnLoop]);
    }
  }

  // play turn
  // assign cards too here.
  let playedOnHand = [];
  for (let handPlays = 0; handPlays < 4; handPlays++) {
    let nextTurn = gameHistoryData.rounds[roundNumber].actions[hand].started;
    playState.playerId = playState.playerIds[(nextTurn + handPlays) % 4];
    playState.cards = availableCards[(nextTurn + handPlays) % 4];
    playState.played = playedOnHand;

    if (turn === (nextTurn + handPlays) % 4) {
      console.log(typeof turn, typeof ((nextTurn + handPlays) % 4));
      return playState;
    }
    playedOnHand.push(
      gameHistoryData.rounds[roundNumber].actions[hand].cards[handPlays]
    );
  }
}

async function displayParsedData() {
  try {
    data = await stateToApiParser();
    console.log(data);
  } catch (err) {
    console.log(err.message);
    console.log(
      `Run node ${scriptName} --help for instructions on how to run the script`
    );
  }
}

displayParsedData();
