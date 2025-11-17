const math = require("mathjs");

class MathService {
  calculateExpression(expression) {
    try {
      // Очищаем выражение от лишних пробелов
      const cleanExpression = expression.replace(/\s+/g, "");

      // Проверяем
      if (!this.isSafeExpression(cleanExpression)) {
        return {
          success: false,
          error: "Выражение содержит недопустимые символы",
        };
      }

      // Вычисляем выражение
      const result = math.evaluate(cleanExpression);

      // Проверяем результат на валидность
      if (typeof result !== "number" || !isFinite(result)) {
        return {
          success: false,
          error: "Невозможно вычислить выражение",
        };
      }

      return {
        success: true,
        result: this.formatNumber(result),
        expression: cleanExpression,
      };
    } catch (error) {
      console.error("Math calculation error:", error);
      return {
        success: false,
        error: "Невозможно вычислить выражение. Проверьте правильность ввода.",
      };
    }
  }

  isSafeExpression(expression) {
    // Разрешаем только простые математические символы
    const safePattern = /^[0-9+\-*/().^]+$/;

    // Запрещаем опасные конструкции
    const dangerousPatterns = [
      /[a-zA-Z_`'"\\]/g, // Все буквы и символы
      /;|&|\||`|\$|@|#|!|~|%|{|}|[<>]/g, // Опасные символы
    ];

    // Проверяем на опасные паттерны
    for (const pattern of dangerousPatterns) {
      if (pattern.test(expression)) {
        return false;
      }
    }

    // Проверяем баланс скобок
    if (!this.hasBalancedParentheses(expression)) {
      return false;
    }

    return safePattern.test(expression);
  }

  hasBalancedParentheses(expression) {
    let balance = 0;

    for (let char of expression) {
      if (char === "(") balance++;
      if (char === ")") balance--;
      if (balance < 0) return false;
    }

    return balance === 0;
  }

  formatNumber(number) {
    // Округляем до 10 знаков после запятой
    const rounded = Math.round(number * 1e10) / 1e10;

    // Если число целое, показываем без дробной части
    if (Number.isInteger(rounded)) {
      return rounded.toString();
    }

    // Для дробных чисел ограничиваем количество знаков
    return parseFloat(rounded.toFixed(6)).toString();
  }
}

module.exports = new MathService();
