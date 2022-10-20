const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const telegramToken = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(telegramToken, { polling: true });

function readFile(fileName) {
  const filepath = `./experiment_results/${fileName}.csv`;
  const fileToSend = fs.createReadStream(filepath);
  return fileToSend;
}

function sendToTelegram(fileName) {
  bot.sendDocument(chatId, readFile(fileName))
    .then(() => console.log('The CSV file was sent successfully'));
}

module.exports = sendToTelegram;
