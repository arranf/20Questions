# brolly-code-test

> An API and (very) basic PWA to play a game of 20 questions.

## About
## Getting Started

1. Use Docker Compose
2. `yarn start` to run the application (defaults to port `3030`) and `yarn test` to run the server's unit tests.

## Detail

### Frontend
I've included a basic webpack-less frontend using [Vue](https://vuejs.org/). To keep things relatively simple I've used script tags, skipped worrying about polyfills, and have kept the styling to very simple CSS. I've also avoided using heavyweight dependencies like VueRouter or Vuex.

### Backend
I opted to use [FeathersJS](https://docs.feathersjs.com/) as a batteries-included real-time server backed by NeDB as opposed to an actual database.


## Obvious Areas for Improvement

### Backend

1. There definitely should be some form of user model and a model for 'games' a user belongs to _or_ a service for channels to enable anonymous users to join a channel for a room. This would prevent real-time events being broadcasted to all users.
2. There should be a JSON schema for each model.
3. There should be integration tests for each service.
4. The backend would also benefit for some typing of the Error classes.


### Frontend
1. As described above there should be some form of build step to transpile and minify JS. It could also use codesplitting etc.
2. Could use unit and E2E tests
3. There is lots of repeated logic in the `host` and `player` components that should be moved to a class instance of `Answer` or `Guess`.

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
