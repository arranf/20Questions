const CodeGenerator = require('../utils/code-generator');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async hook => {
    let codeGenerator = new CodeGenerator(options.codeLength, options.codeLetterChoices);
    let codeIsNotFree = true;
    let randomRoomCode = '';
    let i = 0;
    while (codeIsNotFree) {
      // We won't get a unique code each time but this is a basic approximation for us having put too much effort in to find a code
      if (i > codeGenerator.permutations) {
        throw Error('Unable to find valid room code');
      }
      randomRoomCode = codeGenerator.generate();
      
      const results = await hook.app.service('/games').find({query: {roomCode: randomRoomCode, isFinished: false}});  
      codeIsNotFree = results.length > 0 || (results.data && results.data.length > 0); 
      
      i++;
    }
    hook.data.roomCode = randomRoomCode;
    return hook;
  };
};