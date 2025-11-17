function parseCurrencyMessage(text) {
  // Регулярное выражение для парсинга запросов на конвертацию
  const regex = /^(\d+(?:\.\d+)?)\s*([a-zA-Z]{3})\s+(?:to|в)\s+([a-zA-Z]{3})$/i;
  const match = text.match(regex);

  if (match) {
    return {
      amount: parseFloat(match[1]),
      fromCurrency: match[2].toUpperCase(),
      toCurrency: match[3].toUpperCase(),
    };
  }

  return null;
}

function formatResponse(conversionResult) {
  const { amount, fromCurrency, toCurrency, convertedAmount, rate, timestamp } =
    conversionResult;

  // Форматируем дату как в задании: "12.11.2023"
  const date = new Date(timestamp).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `
Результат конвертации:

${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}

Курс: 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}
По курсу на: ${date}`;
}

function validateAmount(amount) {
  return !isNaN(amount) && amount > 0 && amount < 1e12;
}

module.exports = {
  parseCurrencyMessage,
  formatResponse,
  validateAmount,
};
