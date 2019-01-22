module.exports = () => {
  return async hook => {
    const {data} = hook;

    if (!data.word) {
      throw new Error('Expecting game to have the property \'word\'');
    }

    // Add default data to the trimmed word
    hook.data = {
      word: data.word.trim(),
      isFinished: false,
      questionsLeft: 20
    };
    return hook;
  };
};
