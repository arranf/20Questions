const feathers = require('@feathersjs/feathers');
const setDefaultGameFields = require('../../src/hooks/set-default-game-fields');

describe('\'setDefaultFields\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/games', {
      async create(data) {
        return data;
      }
    });

    app.service('games').hooks({
      before: setDefaultGameFields()
    });
  });

  it('throws if no word provided', async () => {
    expect.assertions(1);
    return expect(app.service('games').create({}))
      .rejects
      .toThrow('Expecting game to have the property \'word\'');
  });

  it('sets the isFinished property to false', async () => {
    expect.assertions(1);
    return expect(app.service('games').create({word: 'batman'}))
      .resolves
      .toHaveProperty('isFinished', false);
  });

  it('sets the questions left property to 20', async () => {
    expect.assertions(1);
    return expect(app.service('games').create({word: 'batman'}))
      .resolves
      .toHaveProperty('questionsLeft', 20);
  });
});
