// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async hook => {
    const gameId = (await hook.service.get(hook.id)).gameId;

    const gamesService = hook.app.service('games');
    const game = await gamesService.get(gameId);
    
    if (game.isFinished) {
      throw Error('Game is already finished');
    }

    if (game.questionsLeft <= 1) {
      await gamesService.patch(gameId, {questionsLeft: 0, isFinished: true});
      gamesService.emit('end', {});
    } else {
      await gamesService.patch(gameId, {questionsLeft: game.questionsLeft - 1});
    }
    return hook;
  };
};
