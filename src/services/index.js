const games = require('./games/games.service.js');
const guesses = require('./guesses/guesses.service.js');
const questions = require('./questions/questions.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(games);
  app.configure(guesses);
  app.configure(questions);
};
