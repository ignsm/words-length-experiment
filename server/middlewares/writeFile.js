const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const sendToTelegram = require('./sendToTelegram');

function writeFile(fileName, data) {
  const csvWriter = createCsvWriter({
    path: `./experiment_results/${fileName}.csv`,
    header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
  });
  csvWriter.writeRecords(data)
    .then(() => sendToTelegram(fileName))
    .then(() => console.log('The CSV file was written successfully'));
}

module.exports = writeFile;