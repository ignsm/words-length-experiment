const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

function writeFile(fileName, data) {
  const csvWriter = createCsvWriter({
    path: `./experiment_results/${fileName}.csv`,
    header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
  });
  csvWriter.writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));
}

module.exports = writeFile;