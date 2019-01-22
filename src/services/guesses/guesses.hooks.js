

const ensureGameValid = require('../../hooks/ensure-game-is-valid');
const ensureOnlyResponseChanged = require('../../hooks/ensure-only-response-changed');
const { required } = require('feathers-hooks-common');

const endGame = require('../../hooks/end-game');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ensureGameValid(), required('guess')],
    update: [],
    patch: [ensureOnlyResponseChanged()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [endGame()],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
