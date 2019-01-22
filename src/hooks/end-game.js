// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async hook => {
    if (!hook.data.response) {
      return hook;
    }
    
    const gameId = (await hook.service.get(hook.id)).gameId;

    const gamesService = hook.app.service('games'); 
    await gamesService.patch(gameId, {isFinished: true});
    gamesService.emit('end', {});
    return hook;
  };
};
