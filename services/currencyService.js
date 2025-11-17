const fetch = require("node-fetch");
const { SUPPORTED_CURRENCIES } = require("../config/constants");

class CurrencyService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 30 * 60 * 1000; // 30 минут кэш
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      // Валидация валют
      if (!this.isCurrencySupported(fromCurrency)) {
        return {
          success: false,
          error: `Валюта "${fromCurrency}" не поддерживается. Доступные валюты: ${SUPPORTED_CURRENCIES.join(
            ", "
          )}`,
        };
      }

      if (!this.isCurrencySupported(toCurrency)) {
        return {
          success: false,
          error: `Валюта "${toCurrency}" не поддерживается. Доступные валюты: ${SUPPORTED_CURRENCIES.join(
            ", "
          )}`,
        };
      }

      // Если конвертируем одинаковые валюты
      if (fromCurrency.toUpperCase() === toCurrency.toUpperCase()) {
        return {
          success: true,
          amount,
          fromCurrency: fromCurrency.toUpperCase(),
          toCurrency: toCurrency.toUpperCase(),
          convertedAmount: amount,
          rate: 1,
          timestamp: Date.now(),
        };
      }

      // Получаем актуальные курсы
      const exchangeRates = await this.getExchangeRates(fromCurrency);

      if (!exchangeRates.success) {
        return exchangeRates;
      }

      const rate = exchangeRates.rates[toCurrency.toUpperCase()];

      if (!rate) {
        return {
          success: false,
          error: `Не удалось получить курс для валюты "${toCurrency}"`,
        };
      }

      const convertedAmount = amount * rate;

      return {
        success: true,
        amount,
        fromCurrency: fromCurrency.toUpperCase(),
        toCurrency: toCurrency.toUpperCase(),
        convertedAmount,
        rate,
        timestamp: exchangeRates.timestamp,
      };
    } catch (error) {
      console.error("Currency conversion error:", error);
      return {
        success: false,
        error: "Ошибка при конвертации валют. Пожалуйста, попробуйте позже.",
      };
    }
  }

  async getExchangeRates(baseCurrency) {
    try {
      const cacheKey = baseCurrency.toUpperCase();
      const cached = this.cache.get(cacheKey);

      // Проверяем кэш
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached;
      }

      console.log("Получаем курсы валют от API...");

      // Используем ExchangeRate-API
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Проверяем наличие необходимых данных
      if (!data || !data.rates) {
        throw new Error("Invalid API response format");
      }

      const result = {
        success: true,
        base: baseCurrency.toUpperCase(),
        rates: data.rates,
        timestamp: Date.now(),
      };

      console.log("Курсы успешно получены для базовой валюты:", baseCurrency);

      // Сохраняем в кэш
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Ошибка получения курсов от API:", error.message);
      return {
        success: false,
        error:
          "Не удалось получить актуальные курсы валют от API. Пожалуйста, попробуйте позже.",
      };
    }
  }

  isCurrencySupported(currency) {
    return SUPPORTED_CURRENCIES.includes(currency.toUpperCase());
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = new CurrencyService();
