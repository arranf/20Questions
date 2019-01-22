// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async hook => {
    const gameId = hook.data.gameId;
    
    if (!gameId) {
      throw new Error('Game Id not found');
    }
    const results = await hook.app.service('games').find({query: {_id: gameId, isFinished: false}});

    if (results.length === 0 || (results.data && results.data.length === 0)) {
      throw new Error('Game not found');
    }
    return hook;
  };
};
