const feathers = require('@feathersjs/feathers');
const decrementQuestionCount = require('../../src/hooks/decrement-question-count');
const memory = require('feathers-memory');

describe('\'decrement-question-count\' hook', () => {
  let app;
  let gameService;
  let questionService;

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
    app.use('/questions', memory(options));

    app.service('questions').hooks({
      after: {
        patch: decrementQuestionCount()
      }
    });

    gameService = app.service('games');
    questionService = app.service('questions');
  });

  it('Decrements the questionsLeft value', async () => {
    // Create game
    await gameService.create({questionsLeft: 20, isFinished: false});

    await questionService.create({gameId: 1});
    await questionService.patch(1, {response : true});

    const resultQuestion = await gameService.get(1);
    expect(resultQuestion).toEqual({ _id: 1, questionsLeft: 19 , isFinished: false});
  });

  it('ends the game if the question count is 0', async () => {
    // Create game
    expect.assertions(2);
    await gameService.create({questionsLeft: 0, isFinished: false});

    // Set up end event listener
    const eventListener = (data) => { expect(data).toBeTruthy(); };
    gameService.on('end', eventListener);

    await questionService.create({gameId: 1});
    await questionService.patch(1, {response : true});

    const resultQuestion = await gameService.get(1);
    expect(resultQuestion).toEqual({ _id: 1, questionsLeft: 0, isFinished: true });
  });

  it('throws if the game is not found', async () => {
    await questionService.create({gameId: 1});
    expect.assertions(1);
    return expect(questionService.patch(1, {response: true}))
      .rejects
      .toThrow();
  });

  it('throws if the game is finished', async () => {
    // Create game
    await gameService.create({questionsLeft: 20, isFinished: true});

    await questionService.create({gameId: 1});
    expect.assertions(1);
    return expect(questionService.patch(1, {response: true}))
      .rejects
      .toThrow();
  });
});
