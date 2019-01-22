// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async hook => {
    const question = await hook.service.get(hook.id);

    if (question.response) {
      throw Error('Already answered');
    }
    
    if (!('response' in hook.data)) {
      throw new Error('No response found');
    }

    const response = hook.data.response;
    
    if (typeof(response) !== 'boolean') {
      throw new Error('Answer is not valid');
    }

    hook.data = {response: response};
    return hook;
  };
};
