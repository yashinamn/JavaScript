"use strict";

/**
 * Объект с настройками игры.
 * @property {int} rowsCount - Количество строк на поле.
 * @property {int} colsCount - Количество колонок на поле.
 * @property {string} blackCellColor - Цвет черной клетки.
 * @property {string} whiteCellColor - Цвет белой клетки.
 */
const settings = {
  rowsCount: 8,
  colsCount: 8,
  blackCellColor: '#888888',
  whiteCellColor: '#EEEEEE',
};

/**
 * Объект игры, здесь будут все методы и свойства связанные с ней.
 * @property {settings} settings Настройки игры.
 * @property {Array} cellElements Массив ячеек нашей игры.
 * @property {HTMLElement} containerElement Контейнер, где будет размещаться наша игра.
 */
const game = {
  settings,
  cellElements: null,
  containerElement: null,
  evenElements: null,

  /**
   * Запускает игру.
   */
  run() {
    // Инициализируем игру.
    this.init();

  },

  /**
   * Инициирует все значения для игры.
   */
  init() {
    // Ставим контейнер игры.
    this.containerElement = document.getElementById('game');
    // Инициируем ячейки.
    this.initCells();
  },

  /**
   * Инициирует ячейки в игре.
   */
  initCells() {
    // Очищаем контейнер для игры.
    this.containerElement.innerHTML = '';
    // Массив ячеек пока пуст.
    this.cellElements = [];
    // Пробегаемся в цикле столько раз, какое количество строк в игре.
    for (let row = 0; row < this.settings.rowsCount; row++) {
      // Создаем новую строку.
      const trElem = document.createElement('tr');
      // Добавляем строку в контейнер с игрой.
      this.containerElement.appendChild(trElem);
      // В каждой строке пробегаемся по циклу столько раз, сколько у нас колонок.
      for (let col = 0; col < this.settings.colsCount; col++) {
        // Создаем ячейку.
        const cell = document.createElement('td');
        //окрашиваем ячейки в черный и белый
        if ((((row + 1)%2 === 0) && ((col + 1)%2 !== 0)) || (((row + 1)%2 !== 0) && ((col + 1)%2 === 0))) {
            cell.style.backgroundColor = this.settings.blackCellColor; 
        } else {
            cell.style.backgroundColor = this.settings.whiteCellColor;    
        }
        // Записываем ячейку в массив ячеек.
        this.cellElements.push(cell);
        
        // Добавляем ячейку в текущую строку.
        trElem.appendChild(cell);
      }
    }
  },
}; 

// Запускаем игру.
window.onload = () => game.run();