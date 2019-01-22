

const ensureGameValid = require('../../hooks/ensure-game-is-valid');
const ensureOnlyResponseChanged = require('../../hooks/ensure-only-response-changed');
const { required } = require('feathers-hooks-common');

const decrementQuestionCount = require('../../hooks/decrement-question-count');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ensureGameValid(), required('question')],
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
    patch: [decrementQuestionCount()],
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
