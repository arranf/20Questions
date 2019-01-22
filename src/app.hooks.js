const log = require('./hooks/log');
const { disallow, setNow } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [ log() ],
    find: [],
    get: [],
    create: [setNow('createdAt', 'updatedAt')],
    update: [disallow('external')],
    patch: [setNow('updatedAt')],
    remove: [disallow('external')]
  },

  after: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ log() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
