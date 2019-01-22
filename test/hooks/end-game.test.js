const feathers = require('@feathersjs/feathers');
const endGame = require('../../src/hooks/end-game');
const memory = require('feathers-memory');

describe('\'end-game\' hook', () => {
  let app;
  let gameService;
  let guessService;

  beforeEach(() => {
    app = feathers();
    
    const options = {
      paginate: {
        default: 10,
        max: 25
      },
      id: '_id',
      startId: 1,
    };


    app.use('/games', memory(options));
    app.use('/guesses', memory(options));

    app.service('guesses').hooks({
      after: {
        patch: endGame()
      }
    });

    gameService = app.service('games');
    guessService = app.service('guesses');
  });

  it('ends the game if the response is yes', async () => {
    // Create game
    await gameService.create({isFinished: false});

    // Set up end event listener
    const eventListener = (data) => { expect(data).toBeTruthy(); };
    gameService.on('end', eventListener);

    await guessService.create({gameId: 1});
    await guessService.patch(1, {response: true});

    const resultQuestion = await gameService.get(1);
    expect(resultQuestion).toEqual({ _id: 1, isFinished: true });
  });

  it('does not end the game if the response is no', async () => {
    // Create game
    await gameService.create({isFinished: false});

    await guessService.create({gameId: 1});
    await guessService.patch(1, {response: false});

    const resultQuestion = await gameService.get(1);
    expect(resultQuestion).toEqual({ _id: 1, isFinished: false });
  });
});
