"use strict";

/**
 * @property {HTMLElement} gameContainerElement - контейнер для игры
 */
const chess = {
  gameContainerElement: document.getElementById('game'),
  figures: [ //массив всех фигур
      {name: 'p', color: 'w', pos: 'a2' },//каждая фигура в виде обекта,
      {name: 'p', color: 'w', pos: 'b2' },//который содержит свойства:
      {name: 'p', color: 'w', pos: 'c2' },//имя, цвет, координаты на поле
      {name: 'p', color: 'w', pos: 'd2' },
      {name: 'p', color: 'w', pos: 'e2' },
      {name: 'p', color: 'w', pos: 'f2' },
      {name: 'p', color: 'w', pos: 'g2' },
      {name: 'p', color: 'w', pos: 'h2' },
      {name: 'R', color: 'w', pos: 'a1' },
      {name: 'N', color: 'w', pos: 'b1' },
      {name: 'B', color: 'w', pos: 'c1' },
      {name: 'Q', color: 'w', pos: 'd1' },
      {name: 'K', color: 'w', pos: 'e1' },
      {name: 'B', color: 'w', pos: 'f1' },
      {name: 'N', color: 'w', pos: 'g1' },
      {name: 'R', color: 'w', pos: 'h1' },

      {name: 'p', color: 'b', pos: 'a7' },
      {name: 'p', color: 'b', pos: 'b7' },
      {name: 'p', color: 'b', pos: 'c7' },
      {name: 'p', color: 'b', pos: 'd7' },
      {name: 'p', color: 'b', pos: 'e7' },
      {name: 'p', color: 'b', pos: 'f7' },
      {name: 'p', color: 'b', pos: 'g7' },
      {name: 'p', color: 'b', pos: 'h7' },
      {name: 'R', color: 'b', pos: 'a8' },
      {name: 'N', color: 'b', pos: 'b8' },
      {name: 'B', color: 'b', pos: 'c8' },
      {name: 'Q', color: 'b', pos: 'd8' },
      {name: 'K', color: 'b', pos: 'e8' },
      {name: 'B', color: 'b', pos: 'f8' },
      {name: 'N', color: 'b', pos: 'g8' },
      {name: 'R', color: 'b', pos: 'h8' },

  ],
//шахматные фигуры в символах
  figureHtml:{ //объект со свойствами в виде имен фигур и их html-символов
      pw: '&#9817;',//имя свойства состоит из буквы  имени и буквы цвета из массива всех фигур figures
      Bw: '&#9815;',
      Nw: '&#9816;',
      Rw: '&#9814;',
      Qw: '&#9813;',
      Kw: '&#9812;',

      pb: '&#9823;',
      Bb: '&#9821;',
      Nb: '&#9822;',
      Rb: '&#9820;',
      Qb: '&#9819;',
      Kb: '&#9818;',
    },
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

        td.dataset.row = rows[row]; //Добавляем в тег td пользовательский атрибут data-row номер строки
        td.dataset.col = cols[col]; //Добавляем в тег td пользовательский атрибут data-col номер столбца
       
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
//метод отрисовки фигур
  renderFigures() {
    for (const figure of this.figures) {//перебипаем весь массив figure
        const col = figure.pos.charAt(0);//возвращаем первый символ из строки pos в фигурe
        const row = figure.pos.charAt(1);//возвращаем второй символ из строки pos в фигурe

        document.querySelector(`[data-col = '${col}'][data-row='${row}']`).innerHTML = //находим конкретный элемент, в котором фигура 
        this.figureHtml[figure.name + figure.color];    //должна стоять и вставляем туда спецсимвол из объекта figureHTML
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
chess.renderFigures();
