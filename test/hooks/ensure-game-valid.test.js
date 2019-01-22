const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const ensureGameIsValid = require('../../src/hooks/ensure-game-is-valid');

describe('\'ensureGameValid\' hook', () => {
  let app;
  let gameService;
  let testService;

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

    // Will be called within hook function
    app.use('/games', memory(options));

    // The hook runs on this service
    app.use('/test', memory(options));

    app.service('/test').hooks({
      before: ensureGameIsValid()
    });

    gameService = app.service('games');
    testService = app.service('test');
  });

  it('Throws if there is game id provided', async () => {
    expect.assertions(1);
    return expect(testService.create({}))
      .rejects
      .toThrow('Game Id not found');
  });

  it('Throws if there is no matching game', async () => {
    expect.assertions(1);
    return expect(testService.create({gameId: 'spiderman'}))
      .rejects
      .toThrow('Game not found');
  });

  it('Throws if game with id is finished', async () => {
    const finishedGame = await gameService.create({isFinished: true});
    expect.assertions(1);
    return expect(testService.create({gameId: finishedGame._id}))
      .rejects
      .toThrow('Game not found');
  });

  it('Passes if a matching game with id is found', async () => {
    const finishedGame = await gameService.create({isFinished: false});
    expect.assertions(1);
    return expect(testService.create({gameId: finishedGame._id}))
      .resolves
      .toBeTruthy();
  });
});
