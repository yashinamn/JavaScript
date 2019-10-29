"use strict";


/**
 * Необходимо реализовать валидацию этой формы по следующим правилам:
* Имя - должно содержать как минимум 1 символ, не более 50 символов.
* Телефон - должно содержать 11 цифр, не больше, не меньше.
* Пароль - минимум 5 символов, максимум 50
* Повтор пароля - значение должно совпадать с полем пароль.
* Кнопка отправить форму - при нажатии на кнопку форма должна провериться, при
прохождении проверки, форма
отправляется, если проверка не была пройдена, то:
- Каждое поле, которое не прошло проверку должно выделяться красным цветом.
- Под каждым полем, что не прошло проверку, должна писаться подсказка по какой причине
проверка провалилась.
 */

/** Объект, содержащий методы для валидации */

const validationMethods = {
  /**метод Проверка поля по длине. 
   * @param {Element} fields Поле, которое надо проверить(input)
   * @param {Array} args Массив с аргументами - условия валидации(то есть длина вводимого значения и оператор (больше, меньше, равно))
   * @returns {string/null} Строку с ошибкой или null , если ошибок не было
   */
  length(field, args) {

    const valLength = field.value.length; //вычисляем длину введенного пользователем значения 
    let sign = args[0]; //знак больше, меньше, равно
    let then = args[1]; // значение  5, 50, 11...

    let message = null; // сообщение под полем если нет ошибки ввода
    switch (sign) { // перебор всех символов больше, меньше, равно
      case '>':
        if (!(valLength > then)) { //если ввели не больше минимального значения, то
          message = `Минимальная длина поля: ${then + 1}.`; // сообщение об ошибке следующее
        }
        break;
      case '<':
        if (!(valLength < then)) { //если ввели не меньше максимального значения, то
          message = `Максимальная длина поля: ${then - 1}.`; // сообщение об ошибке следующее
        }
        break;
      case '>=':
        if (!(valLength >= then)) {
          message = `Минимальная длина поля: ${then}.`; // сообщение об ошибке следующее
        }
        break;
      case '<=':
        if (!(valLength <= then)) {
          message = `Максимальная длина поля: ${then}.`; // сообщение об ошибке следующее
        }
        break;
      case '==':
        if (valLength !== then) { //если длина не равно условной длине
          message = `Длина поля должна равняться: ${then}.`; // сообщение об ошибке следующее
        }
        break;
    }
    return message; //возвращаем значение сообщения
  },

  /**Метод Проверяет содержит ли поле телефона только цифры. 
   * @param {Element} fields Поле, которое надо проверить
   * @returns {string/null} Строку с ошибкой или null , если ошибок не было
   */
  mustContainsNumber(field) {
    for (const val of field.value) { //проверяем каждый введеный знак на соответствие его цифре
      if (!Number.isInteger(Number.parseInt(val))) { //превращаем каждый знак в число и проверяем
        return `Номер должен содержать только цифры`;
      }
    }
    return null;
  },

  /**Метод проверяет совпадают ли у двух полей значения(для повтора пароля)
   * @param {Element} fields Поле, которое надо проверить
   * @param {Array} args Массив с аргументами
   * @returns {string/null} Строку с ошибкой или null , если ошибок не было
   */
  fieldsCompare(field, args) { //сверяет значение поля Повторите пароль со значение поля Пароль
    return field.value !== document.querySelector(args[0]).value ? `Поля не совпадают` : null; //
  },
};

/**Объект формы */
 
const form = {
  formEl: null,
  rules: null,
  /**Инициализация формы
   */
  init() {
    this.formEl = document.querySelector('.my-form'); //получаем элемент формы по классу
    this.formEl.addEventListener('submit', e => this.formSubmit(e)); // добавляем этому элементу слушателя события submit который вызывает функцию отправки формы после пройденной валидации
    //правила для каждого поля input. Каждое правило это объект
    this.rules = [//правила проверки валидации
      { 
        selector: 'input[name="name"]', // поле Имя
        methods: [ 
          {name: 'length', args: ['>=', 1]}, // вызывает функцию проверки длины//какая именно длина должна быть
          {name: 'length', args: ['<=', 50]},// вызывает функцию проверки длины//какая именно длина должна быть
        ],
      },
      {
        selector: 'input[name="phone"]', // поле Телефон
        methods: [
          {name: 'mustContainsNumber'},// вызывает функцию проверки на цифры
          {name: 'length', args: ['==', 11]},// вызывает функцию проверки длины // какая именно длина должна быть
        ],
      },
      {
        selector: 'input[name="password"]', //поле Пароль
        methods: [
          {name: 'length', args: ['>=', 5]},// вызывает функцию проверки длины  // какая именно длина должна быть
          {name: 'length', args: ['<=', 50]},// вызывает функцию проверки длины // какая именно длина должна быть  
        ],
      },
      {
        selector: 'input[name="password-repeat"]', // поле повторить пароль
        methods: [
          {name: 'fieldsCompare', args: ['input[name="password"]']},//вызывает функцию проверки идентичности паролей //значение поля Пароль 
         ],
      },
    ];
  },

  /**Метод, который запускаетсяперед отправкой формы
   * @param {event} e Событие отправки формы
   */
  formSubmit(e) {
    if (!this.validate()) {//если форма не валидна
      e.preventDefault(); //прерываем отправку формы по умолчанию
    }
  },
 
  /**Метод валидирует форму (запишем отдельно ПРАВИЛА отдель МЕТОДЫ)
   * @param правила валидации
   */
  validate() {
    let isValid = true; //определяем валидность формы по умолчанию
    for (let rule of this.rules) { //для каждого правила из правил валидции
      const inputEl = document.querySelector(rule.selector); //находим по селектору из правил конкретное поле
      for (let method of rule.methods) { //для каждого метода из методов вышеуказанного правила
        const validFunction = validationMethods[method.name]; //создаем функцию из объекта методов валидации(length, mustContainsNumber, fieldsCompare)
        const errMessage = validFunction(inputEl, method.args); // создаем переменную сообщения, в которую кладем функцию с аргуметами в виде поля и аргументов из праивил
        if (errMessage) { //если функция дает строку шибки
          this.setInvalidField(inputEl, errMessage); //ставим класс инвалид и выводим ошибочное сообщение
          isValid = false;
          break;
        } else {
          this.setValidField(inputEl);
        }
      }
    }
    return isValid;
  },

  /**Метод, когда пользователь ошибся
   * Устанавливает класс провала инпуту и ставит сообщение о том, почему валидация провалилась
   * @param {Element} fields Элемент инпута, который провалил валидацию
   * @param {string} message Ссообщение об ошибке
   */
  setInvalidField(inputEl, message) {
    const cl = inputEl.classList; // коллекция классов у элемента инпут
    cl.remove('is-valid'); //удаляем валидный класc если такой был
    cl.add('is-invalid'); //добавляем класс инвалидный

    let hintWrap = inputEl.parentNode.querySelector('.invalid-feedback'); //находим в родительском элемеенте инпута тег с классом invalid-feedback
    if (!hintWrap) { // если такого элемента нет, то
      hintWrap = document.createElement('div'); //нужно его создать
      hintWrap.classList.add('invalid-feedback'); // добавить ему класс 'invalid-feedback'
      inputEl.parentNode.appendChild(hintWrap); //добавляем ребенка в родительский элемент инпута
    }

    hintWrap.textContent = message;
  },

  /**Метод, когда пользователь НЕ ошибся
   * Устанавливает класс прохождения валидации инпуту б убирает сообщение о валидации если такое было
   * @param {Element} fields Поле, которое надо проверить
   * */
  setValidField(inputEl) {
    const cl = inputEl.classList; // коллекция классов у элемента инпут
    cl.remove('is-invalid'); //удаляем ИНвалидный клаcс если такой был
    cl.add('is-valid'); //добавляем класс валидный

    let hintWrap = inputEl.parentNode.querySelector('.invalid-feedback');
    if (hintWrap) { // если такой элемент есть, то
      inputEl.parentNode.removeChild(hintWrap); //удаляем ребенка в родительском элементе инпута
    }
  },
};

form.init();