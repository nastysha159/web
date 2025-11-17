const TelegramBot = require("node-telegram-bot-api");
const currencyService = require("./services/currencyService");
const mathService = require("./services/mathService");
const { parseCurrencyMessage, formatResponse } = require("./utils/helpers");
const { BOT_TOKEN } = require("./config/constants");

// Инициализация бота
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log("Бот запущен и готов к работе!");

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `👋 Привет, ${msg.from.first_name}!

Я - умный конвертер и калькулятор! Вот что я умею:

Конвертация валют:
• 100 USD to EUR
• 1500 RUB to USD  
• 50 EUR to RUB

Математические расчеты:
• (15 + 7) * 2
• 10 / 2 + 5
• 2^3 * 4

Просто отправь мне сообщение в одном из этих форматов!`;

  bot.sendMessage(chatId, welcomeMessage);
});

// Обработка команды /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `📖 Помощь по использованию бота

Конвертация валют:
Формат: <сумма> <из валюты> to <в валюту>
Примеры:
• 100 USD to EUR
• 1500 RUB to USD
• 50 EUR to RUB

Математические расчеты:
Поддерживаются операции: +, -, *, /, ^, скобки
Примеры:
• (15 + 7) * 2
• 10 / 2 + 5
• 2^3 * 4

Доступные команды:
/start - начать работу
/help - показать справку`;

  bot.sendMessage(chatId, helpMessage);
});

// Обработка текстовых сообщений
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim();

  if (!text || text.startsWith("/")) return;

  try {
    const currencyMatch = parseCurrencyMessage(text);
    if (currencyMatch) {
      await handleCurrencyConversion(chatId, currencyMatch);
      return;
    }
    await handleMathCalculation(chatId, text);
  } catch (error) {
    bot.sendMessage(chatId, "Ошибка обработки запроса.");
  }
});

async function handleCurrencyConversion(
  chatId,
  { amount, fromCurrency, toCurrency }
) {
  try {
    bot.sendChatAction(chatId, "typing");
    const result = await currencyService.convertCurrency(
      amount,
      fromCurrency,
      toCurrency
    );

    if (result.success) {
      bot.sendMessage(chatId, formatResponse(result));
    } else {
      bot.sendMessage(chatId, `${result.error}`);
    }
  } catch (error) {
    bot.sendMessage(chatId, "Ошибка конвертации валют.");
  }
}

async function handleMathCalculation(chatId, expression) {
  try {
    bot.sendChatAction(chatId, "typing");
    const result = mathService.calculateExpression(expression);

    if (result.success) {
      bot.sendMessage(chatId, `${expression} = ${result.result}`);
    } else {
      bot.sendMessage(chatId, `${result.error}`);
    }
  } catch (error) {
    bot.sendMessage(chatId, "Ошибка вычисления.");
  }
}
