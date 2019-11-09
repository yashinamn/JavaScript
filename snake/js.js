"use strict";

const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
};

const config = {
    settings,

    init(userSettings) {
        Object.assign(this.settings, userSettings);
    },

    validate() {
        const result = {
            isValid: true,
            errors: [],
        };

        if (this.settings.speed < 1 || this.settings.speed > 10) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].')
        }

        if (this.settings.rowsCount < 10 || this.settings.rowsCount > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].')
        }

        if (this.settings.colsCount < 10 || this.settings.colsCount > 30) {
            result.isValid = false;
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].')
        }
        return result;
    },

    getRowsCount() {
        return this.settings.rowsCount;
    },

    getColsCount() {
        return this.settings.colsCount;
    },

    getSpeed() {
        return this.settings.speed;
    },
};

const map = {  
    cell: null,
    init(rowsCount, colsCount) {
        const table = document.getElementById('game');
        table.innerHTML = "";
        
        this.cell = {};

        for (let row = 0; row < rowsCount; row++) { //цикл всех строк
            const tr = document.createElement('tr'); //созадние тега строки tr
            tr.classList.add('row');
            table.appendChild(tr); //добавление тега строки в html-контейнер тег table (id="game")
            
            for (let col = 0; col < colsCount; col++) { //цикл всех столбцов
              const td = document.createElement('td'); //создание тега колонки td
              td.classList.add('cell');

                this.cell[`x${col}_y${row}`] = td;

              tr.appendChild(td); //Добавление стобца td в строку tr
            }
        }
    },
};

const snake = {
    body: null,
    direction: null,
};

const food ={
    x: null,
    y: null,
};

const status = {

};

const game = {
    config,
    map,
    snake,
    food,
    status,

    init(userSettings) {
        this.config.init(userSettings);

        const validation = this.config.validate();
        
        if (!validation.isValid) {
            for (const err of validation.errors) {
                console.error(err);       
            }
            return; 
        }  
        
        this.map.init(this.config.getRowsCount(), this.config.getColsCount());
    }
};

game.init({speed: 8});