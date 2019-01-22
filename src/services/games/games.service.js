// Initializes the `games` service on path `/games`
const createService = require('feathers-nedb');
const createModel = require('../../models/games.model');
const hooks = require('./games.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/games', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('games');

  service.hooks(hooks);
  service.events = ['end'];
};
