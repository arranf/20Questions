

const setDefaultFields = require('../../hooks/set-default-game-fields');
const generateRoomCode = require('../../hooks/generate-room-code');
const { disallow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [setDefaultFields(), generateRoomCode()],
    update: [],
    patch: [disallow('external')],
    remove: []
  },

  after: {
    all: [],
    find: [
      // No user ids to check on (as no auth), otherwise we could discard this if not the person who started the game
      // discard(WORD_FIELD)
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
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
