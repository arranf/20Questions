// Initializes the `guesses` service on path `/guesses`
const createService = require('feathers-nedb');
const createModel = require('../../models/guesses.model');
const hooks = require('./guesses.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/guesses', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('guesses');

  service.hooks(hooks);
};
