"use strict";
/***настройки */
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
};
/**конфигурации */
const config = {
    settings,
/***инициализация конфигураций  */
    init(userSettings) {//принимаем пользовательские настройки
        Object.assign(this.settings, userSettings);//копируем пользовательские настройки и добавляем их в общие настройки
    },
/**метод валидации */
    validate() {
        const result = {
            isValid: true,//свойство валидности
            errors: [],//массив ошибок
        };

        if (this.settings.speed < 1 || this.settings.speed > 10) {//если скорость не валидна
            result.isValid = false;//свойство валидности - ошибка
            result.errors.push('Неверные настройки, значение speed должно быть в диапазоне [1, 10].')//добавляем в массив ошибок новый элемент
        }

        if (this.settings.rowsCount < 10 || this.settings.rowsCount > 30) {//если количество строк не валидно
            result.isValid = false;//свойство валидности - ошибка
            result.errors.push('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].')//добавляем в массив ошибок новый элемент
        }

        if (this.settings.colsCount < 10 || this.settings.colsCount > 30) {//если количство столбцов не валидно
            result.isValid = false;//свойство валидности - ошибка
            result.errors.push('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].')//добавляем в массив ошибок новый элемент
        }
        return result;
    },
/**метод геттер количества строк */
    getRowsCount() {
        return this.settings.rowsCount;
    },
/**метод геттер количества столбцов */
    getColsCount() {
        return this.settings.colsCount;
    },
/**метод геттер показателя скорости */
    getSpeed() {
        return this.settings.speed;
    },
};
/**карта */
const map = {  
    cell: null,//ячейки
    usedCells: null,//заполненные ячейки
    /**инициализация карты */
    init(rowsCount, colsCount) {//принимает количество строк и столбцов из конфигурации
        const table = document.getElementById('game'); //находим тэг элемент игры
        table.innerHTML = "";//делаем его пустым
        
        this.cells = {};//объект ячеек
        this.usedCells = [];//массив заполненных ячеек

        for (let row = 0; row < rowsCount; row++) { //цикл всех строк
            const tr = document.createElement('tr'); //созадние тега строки tr
            tr.classList.add('row');//добавляем класс
            table.appendChild(tr); //добавление тега строки в html-контейнер тег table (id="game")
            
            for (let col = 0; col < colsCount; col++) { //цикл всех столбцов
              const td = document.createElement('td'); //создание тега колонки td
              td.classList.add('cell');//добавляем класс

              this.cells[`x${col}_y${row}`] = td;//создаем ключи каждой ячейке тд, чтоб потом доставать

              tr.appendChild(td); //Добавление стобца td в строку tr
            }
        }
        console.log(this.cells[`x5_y12`]);   
    
    
    },
    render(snakePointsArray, foodPoint) {
        for (const cell of this.usedCells) {
            cell.className = 'cell';
        }
        this.usedCells = [];

        snakePointsArray.forEach((point, idx) => {
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBoby');
            this.usedCells.push(snakeCell);
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];
        foodCell.classList.add('food');
        this.usedCells.push(foodCell);

    },
};
/***змейка */
const snake = {
    body: null,//тело змейки
    direction: null,//направление змейки
/**инициализация змейки */
    init(startBody, startDirection) {//принимаем стартовое положение и направление
        this.body = startBody; //в тело змейки ставим координаты стартовое положение
        this.direction = startDirection;//в анправление ставим направление 
    },

    getBody() {
        return this.body;//тело змейки массив
    },
    
};
/**еда */
const food = {
    x: null,
    y: null,
/**метод получения координат еды */
    getCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },
/**метод установки координат */
    setCoordinates(point) {//принимает точку дто объект
            this.x = point.x;
            this.y = point.y;
    },
};
/**статус */
const status = {

};
/**игра */
const game = {
    config,
    map,
    snake,
    food,
    status,
/**инициализации игры */
    init(userSettings) {
        this.config.init(userSettings);//инициализация конфигураций с пользовательскими настройками

        const validation = this.config.validate();//переменная валидации
        
        if (!validation.isValid) {//если валидаия не прошла
            for (const err of validation.errors) {//в массиве ошибок перебираем каждую
                console.error(err);       
            }
            return; 
        }  
        
        this.map.init(this.config.getRowsCount(), this.config.getColsCount());//запускаем инициализацию карты(переменные передаем количество строк и колонок)
        this.setEventHandlers();
        this.reset()//запускаем очистку перeд новой игрой
    },
/**метод очистки ячеек */
    reset() {
        this.stop();//ставим стоп игры
        this.snake.init(this.getStartSnakeBody(), 'up');//ставим змейку в начало
        this.food.setCoordinates(this.getRandomFreeCoordinates());//еду в нач положение принимает точку случайную
        this.map.render(this.snake.getBody(), this.food.getCoordinates());//отрисовываем
    },

    play() {

    }, 

    stop() {

    },

    finish() {

    },
/**метод ставит змейку на старт */
    getStartSnakeBody() {
        return [{//возвращает
            x: Math.floor(this.config.getColsCount() / 2),//положение по х
            y: Math.floor(this.config.getRowsCount() / 2),//положение по у
        }];
    },
/**метод  получения точки, случайных свободных сооринат для еды */
    getRandomFreeCoordinates() {
        const exclude = [this.food.getCoordinates(), ...this.snake.getBody()];//сначала создаем массив точек,которые заняты едой и телом змейки

        while (true) {
            const rndPoint = {
                x: Math.floor(Math.random() * this.config.getColsCount()),//округляем случйное число
                y: Math.floor(Math.random() * this.config.getRowsCount()),//округляем случайное число
            };

            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                return rndPoint;
            }
        }
    },

    setEventHandlers() {//ставим обработчик события

    },
};

/**запуск игры */
game.init({speed: 8});//меняем скорость на 8