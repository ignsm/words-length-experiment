function parseExpResults(data) {
  const flatData = [];
  for (const round in data) {
    const roundData = data[round];
    const words = roundData.words;
    const answers = roundData.answers;
    const time = roundData.time;
    const userData = roundData.userData;

    const roundProcessed = {...userData};
    for (let i = 0; i < words.length; i++) {
      roundProcessed[`W${i + 1}`] = words[i];
      roundProcessed[`w${i + 1}`] = answers[i];
      roundProcessed[`rt${i + 1}`] = time[i];
    };
    flatData.push(roundProcessed);
  }
  return flatData;
}

module.exports = parseExpResults;