// Токен бота - замените на ваш реальный токен
const BOT_TOKEN =
  process.env.BOT_TOKEN || "8594343228:AAFnRtoGRiTnpXAE-3hJNbAxn83yXZLb3Sc";

// API для получения курсов валют (используем бесплатное API exchangerate-api.com)
const CURRENCY_API_URL = "https://api.exchangerate-api.com/v4/latest/";

// Поддерживаемые валюты
const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "RUB",
  "GBP",
  "JPY",
  "CNY",
  "CAD",
  "AUD",
  "CHF",
  "SGD",
  "HKD",
  "TRY",
];

// Команды бота
const COMMANDS = {
  START: "/start",
  HELP: "/help",
};

module.exports = {
  BOT_TOKEN,
  CURRENCY_API_URL,
  SUPPORTED_CURRENCIES,
  COMMANDS,
};
