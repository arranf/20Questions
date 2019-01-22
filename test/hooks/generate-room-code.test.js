const feathers = require('@feathersjs/feathers');
const memory = require('feathers-memory');
const generateRoomCode = require('../../src/hooks/generate-room-code');

describe('\'generateRoomCode\' hook', () => {
  let app;

  beforeEach(() => {
    // feathers-memory options
    const options = {
      id: '_id',
      startId: 1
    };
    
    app = feathers();
    // use feathers-memory as it implements the query api
    app.use('/games', memory(options));

    app.service('games').hooks({
      before: {
        create: generateRoomCode()
      }
    });
  });

  it('Adds the room code property with correct length string', async () => {
    expect.assertions(3);
    const result = await app.service('games').create({});
    expect(result).toHaveProperty('roomCode');
    expect(result.roomCode).toHaveLength(7);
    expect(result.roomCode).toEqual(expect.any(String));
  });

  it('Returns codes of a specified length', async () => {
    const gamesService = app.service('games');
    // There should only be 1 code available
    gamesService.hooks({
      before: {
        create: generateRoomCode({codeLength: 1})
      }
    });

    const result = await gamesService.create({});
    expect(result.roomCode).toHaveLength(1);
  });

  it('Works with pagination enabled', async () => {
    const options = {
      id: '_id',
      startId: 1,
      paginate: {
        default: 10,
        max: 25
      }
    };
    app.use('/games', memory(options));

    app.service('games').hooks({
      before: {
        create: generateRoomCode()
      }
    });

    expect.assertions(1);
    return expect(app.service('games').create({}))
      .resolves
      .toBeTruthy();
  });

  it('Throws an exception if a valid code cannot be found quickly', async () => {
    const gamesService = app.service('games');
    // There should only be 1 code available
    gamesService.hooks({
      before: {
        create: generateRoomCode({codeLength: 1, codeLetterChoices: ['a']})
      }
    });

    // Reserve 'a' room code
    await gamesService.create({isFinished: false});

    expect.assertions(1);
    return expect(app.service('games').create({}))
      .rejects
      .toThrow('Unable to find valid room code');
  });
});
