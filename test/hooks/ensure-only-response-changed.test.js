const feathers = require('@feathersjs/feathers');
const ensureOnlyResponseChanged = require('../../src/hooks/ensure-only-response-changed');
const memory = require('feathers-memory');

describe('\'ensure-only-response-changed\' hook', () => {
  let app;

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

    app.use('/dummy', memory(options));

    app.service('dummy').hooks({
      before: {
        patch: ensureOnlyResponseChanged()
      }
    });

    app.service('dummy').create({question: 'Evacuate? In our moment of triumph?'});
  });

  it('runs the hook successfully on unanswered questions that are yes or no', async () => {
    expect.assertions(1);
    const result = await app.service('dummy').patch(1, {response: true});
    expect(result).toEqual({ _id: 1, response: true, question: 'Evacuate? In our moment of triumph?'});
  });

  it('Throws on questions that don\'t exist', async () => {
    expect.assertions(1);
    return expect(app.service('dummy').patch(42, {response: true}))
      .rejects
      .toThrow();
  });

  it('Throws on answered questions', async () => {
    // Add answer
    await app.service('dummy').patch(1, {response: true});
    
    expect.assertions(1);
    return expect(app.service('dummy').patch(1, {response: true}))
      .rejects
      .toThrow('Already answered');
  });


  it('Throws when no response provided', async () => {
    expect.assertions(1);
    return expect(app.service('dummy').patch(1, {}))
      .rejects
      .toThrow('No response found');
  });

  it('Throws when no response provided', async () => {
    expect.assertions(1);
    return expect(app.service('dummy').patch(1, {response: 'Mr. Fantastic'}))
      .rejects
      .toThrow('Answer is not valid');
  });
});
