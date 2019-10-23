"use strict";

/**
 * @property {HTMLElement} gameContainerElement - контейнер для игры
 */
const chess = {
  gameContainerElement: document.getElementById('game'),
  //метод отрисовки поля
  renderField() {
    const rows = [0, 8, 7, 6, 5, 4, 3, 2, 1, 0]; //массив цифр для строк
    const cols = [0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 0]; //массив букв для столбцов
    for (let row = 0; row < rows.length; row++) { //цикл всех строк
      const tr = document.createElement('tr'); //созадние тега строки tr
      this.gameContainerElement.appendChild(tr); //добавление тега строки в html-контейнер тег table (id="game")
      for (let col = 0; col < cols.length; col++) { //цикл всех столбцов
        const td = document.createElement('td'); //создание тега колонки td
        tr.appendChild(td); //Добавление стобца td в строку tr

        if (rows[row] === 0 && cols[col] !== 0) {
          td.innerHTML = cols[col];
        }

        if (cols[col] === 0 && rows[row] !== 0) {
          td.innerHTML = rows[row];
        }

        if (this.isCellIsBlack(row, col)) {
          td.style.backgroundColor = 'grey';
        }
      }
    }
  },

  /**
   * Определяет является ли ячека черной.
   * @param {Int} row номер в строке
   * @param {Int} col Номер в колонке
   * @returns {boolean} true если ячейка должна быть черная
   */
  isCellIsBlack(row, col) {
    if (row !== 0 && col !== 0 && row !== 9 && col !== 9) {
      return (row % 2 === 1 && col % 2 === 0) || (row % 2 === 0 && col % 2 === 1);
    } 
  },
};

chess.renderField();