"use strict";

/**
 * Объект, содержащий методы для валидации
 */
const validationMethods = {
  /**
   * Проверка поля по длине.
   * @param {HTMLInputElement} fields Поле, которое надо проверить
   * @param {Array} args Массив с аргументами
   * @returns {string/null} Строку с ошибкой или null , если ошибок не было
   */
  length(field, args) {

    const valLength = field.value.length;
    let sign = args[0];
    let then = args[1];

    let message = null;
    switch (sign) {
      case '>':
        if (!(valLength > then)) {
          message = `Минимальная длина поля: ${then + 1}.`;
        }
        break;
      case '<':
        if (!(valLength < then)) {
          message = `Максимальная длина поля: ${then - 1}.`;
        }
        break;
      case '>=':
        if (!(valLength >= then)) {
          message = `Минимальная длина поля: ${then}.`;
        }
        break;
      case '<=':
        if (!(valLength <= then)) {
          message = `Максимальная длина поля: ${then}.`;
        }
        break;
      case '==':
        if (valLength !== then) {
          message = `Длина поля должна равняться: ${then}.`;
        }
        break;
    }
    return message;
  },
  /**
   * Проверяет содержит ли поле толко цифры.
   * @param {HTMLInputElement} fields Поле, которое надо проверить
   * @returns {string/null} Строку с ошибкой или null , если ошибок не было
   */
  mustContainsNumber(field) {
    for (const val of field.value) {
      if (!isInteger(Number.parseInt(val))) { //превращаем каждый знак в число и проверяем
        return `Номер должен содержать только цифры`;
      }
    }
    return null;
  },
  /**
   * Метод проверяет совпадают ли у двух полей значения
   * @param {HTMLInputElement} fields Поле, которое надо проверить
   * @returns {string/null} Строку с ошибкой или null , если ошибок не было
   * @param {Array} args Массив с аргументами
   */
  fieldsCompare(field, args) {
    return field.value !== document.querySelector(args[0]).value ? `Поля не совпадают` : null;
  },
}

/**
 * Объект формы
 */
const form = {
  formEl: null,
  rules: null,
  /**
   * Инициализация формы
   */
  init() {
    this.formEl = document.querySelector('.my-form');
    this.formEl.addEventListener('submit', e => this.formSubmit(e));

    this.rules = [{
        selector: 'input[name="name"]',
        methods: [{
            name: 'length',
            args: ['>=', 1]
          },
          {
            name: 'length',
            args: ['<=', 50]
          },
        ],
      },
      {
        selector: 'input[name="phone"]',
        methods: [{
            name: 'mustContainsNumber'
          },
          {
            name: 'length',
            args: ['==', 11]
          },
        ],
      },
      {
        selector: 'input[name="password"]',
        methods: [{
            name: 'length',
            args: ['>=', 11]
          },
          {
            name: 'length',
            args: ['<=', 50]
          },
        ],
      },
      {
        selector: 'input[name="password-repeat"]',
        methods: [{
          name: 'fieldsCompare',
          args: ['input[name="password"]']
        }, ],
      },
    ];
  },

  /**
   * Метод, который запускаетсяперед отправкой формы
   * @param {event} e Событие отправки формы
   */
  formSubmit(e) {
    if (!this.validate()) {
      e.preventDefault(); //останавливаем отправку формы по умолчанию
    }
  },
  /**
   * Метод Проверяет валидность заполненной формы(запишем отдельно ПРАВИЛА отдель МЕТОДЫ)
   */
  validate() {
    let isValid = true;
    for (let rule of this.rules) {
      const inputEl = document.querySelector(rule.selector);
      for (let method of rule.methods) {
        const validFunction = validationMethods[method.name];
        const errMessage = validFunction(inputEl, method.args);
        if (errMessage) {
          console.log(errMessage);
          isValid = false;
        } else {
          console.log(`Ошибки не было.`);
        }
      }
    }
    return isValid;
  },
};

form.init();