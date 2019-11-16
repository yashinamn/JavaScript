"use strict";


/***настройки 
 * @property {int} rowsCount Количество строк.
 * @property {int} colsCount Количество колонок.
 * @property {int} speed Скорость змейки.
 * @property {int} winLength Длина змейки для победы.
*/
const settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 2,
    winFoodCount: 50,
};


/**конфигурации 
 ** Объект конфига игры, содержащий методы получения настроек и проверки этих настроек.
 * @property {settings} settings Настройки игры.
*/
const config = {
    settings,
/***инициализация конфигураций  
* Инициализация настроек игры.
   * @param {Object} userSettings Объект с пользовательскими настройками игры.
*/
    init(userSettings) {//принимаем пользовательские настройки
        Object.assign(this.settings, userSettings);//копируем пользовательские настройки и добавляем их в общие настройки
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

    getWinFoodCount() {
        return this.settings.winFoodCount;
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

};


/**карта */
const map = {  
    cell: null,//ячейки
    usedCells: null,//заполненные ячейки массив
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
    /**метод отрисовки карты рендер, принмает массив точек змейки и точку еды */
    render(snakePointsArray, foodPoint) {
        for (const cell of this.usedCells) {// для всех яччек из массива заполненных
            cell.className = 'cell';//прсваиваем класс и удаляем все другие классы
        }
        this.usedCells = [];//массив заполненных ячеек

        snakePointsArray.forEach((point, idx) => {//для массива с ячейками тела змеи применяем функцию форич в которую передаем точку и индекс точки
            const snakeCell = this.cells[`x${point.x}_y${point.y}`];//   ???
            snakeCell.classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');//присваиваем ячейкам тела змейки класс тело змеи или голова змеи если это первый элемент массива
            this.usedCells.push(snakeCell);//добавляем в массив заполненных ячеек ячейку с телом змейки
        });

        const foodCell = this.cells[`x${foodPoint.x}_y${foodPoint.y}`];//   ???
        foodCell.classList.add('food');//присваиваем ячейке еды класс фуд
        this.usedCells.push(foodCell);//добавляем в массив заполненных ячеек ячейку с едой

    },
};


/***змейка */
const snake = {
    body: null,//тело змейки
    direction: null,//направление змейки
    lastStopDirection: null,
/**инициализация змейки */
    init(startBody, startDirection) {//принимаем стартовое положение и направление
        this.body = startBody; //в тело змейки ставим координаты стартовое положение
        this.direction = startDirection;//в анправление ставим направление 
        this.lastStopDirection = startDirection;
    },

    getBody() {
        return this.body;//тело змейки массив
    },

    getLastStepDirection() {
        return this.lastStepDirection;
    },

    getNextStepHeadPoint() {
        const firstPoint = this.body[0];//точка головы на данный момент

        switch (this.direction) {//получаем точку дле дальше должна оказаться голова змейки
            case 'up'://направление вверх
                return {x: firstPoint.x, y: firstPoint.y - 1};
            case 'right':
                return {x: firstPoint.x + 1, y: firstPoint.y};
            case 'down':
                return {x: firstPoint.x, y: firstPoint.y + 1};
            case 'left':
                return {x: firstPoint.x - 1, y: firstPoint.y};
        }
    },

    isOnPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);//перебираем массив тела змейки на премет наличия в ней следующей точки
    }, 

    /**метод делает шаг */
    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint());//добавляем в массив тела змеи нвоую точку
        this.body.pop();//удаляем последнюю точку тела змеи
    },

    setDirection(direction) {
        this.direction = direction;
    },

    growUp() {
        const lastBodyIdx = this.body.length - 1; 
        const lastBodyPoint = this.body[lastBodyIdx];
        const lastBodyPointClone  = Object.assign({}, lastBodyPoint);
        this.body.push(lastBodyPointClone);

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

    isOnPoint(point) {
        return point.x === this.x && point.y === this.y;
    },
};


/**статус */
const status = {
    condition: null,

    setPaying() {
        this.condition = 'playing';
    },

    setStopped() {
        this.condition = 'stopped';
    },

    setFinished() {
        this.condition = 'finished';
    },

    isPlaying() {
        return this.condition === 'playing';
    },

    isStopped() {
        return this.condition === 'stopped';
    },  
};


/**игра */
const game = {
    config,
    map,
    snake,
    food,
    status,
    tickInterval: null,
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
/**метод очистки ячеек игра в начальное положение */
    reset() {
        this.stop();//ставим стоп игры
        this.snake.init(this.getStartSnakeBody(), 'up');//ставим змейку в начало
        this.food.setCoordinates(this.getRandomFreeCoordinates());//еду в нач положение принимает точку случайную
        this.render();//отрисовываем
        
    },
/**установка статуса игры */
    play() {
        this.status.setPaying();//устанавливаем статус играем
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.config.getSpeed());//ставим интервал
        this.setPlayButton('Стоп');//устанавливаем на кнопку слово "стоп"
    }, 
/**установка статуса остановки игры */
    stop() {
        this.status.setStopped();
        clearInterval(this.tickInterval);
        this.setPlayButton('Старт');//устанавливаем на кнопку слово "старт"
    },
/**установка статуса окончания игры */
    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        this.setPlayButton('Игра завершена', true);//устанавливаем на кнопку слова "Игра завершена"
    },
/**Обработчик тика */
    tickHandler() {
        if  (!this.canMakeStep()) {
            return this.finish();
        } 

        if (this.food.isOnPoint(this.snake.getNextStepHeadPoint())) {
            this.snake.growUp();
            this.food.setCoordinates(this.getRandomFreeCoordinates());

            if (this.isGameWon()) {
                this.finish();
            }
        }
        
        this.snake.makeStep();
        this.render();
    },

    isGameWon() {
        return this.snake.getBody().length > this.config.getWinFoodCount();
    },

    render() {
        this.map.render(this.snake.getBody(), this.food.getCoordinates());
    },
/**Метод меняет текст кнопку игры */
    setPlayButton(textContent, isDisabled = false) {//передаем текст и надо ли кнопку сделать серой
        const playButton = document.getElementById('playButton');//находим кнопку
        playButton.textContent = textContent;//ставим ей текст
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');//если надо ее сделать серой, то ставим класс дисэйблед, иначе убираем этот класс 
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

            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {//условие если в массиве заполненных точек нет нашей случайной точки
                return rndPoint;//то возвращаем эту точку
            }
        }
    },

    setEventHandlers() {//ставим обработчик события
      //кнопка игры
      document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());  
      //кнопка новой игры
      document.getElementById('newGameButton').addEventListener('click', () => this.newGameClickHandler()); 
      //
      document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
       if (!this.status.isPlaying()) {
           return;
       }
      
       const direction = this.getDirectionByCode(event.code);

       if (this.canSetDirection(direction)) {
           this.snake.setDirection(direction);
       }
       
    },

    getDirectionByCode(code) {
        switch (code) {//код клавиши
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
            default:
                return '';
        }
    },

/**метод определяющий можно ли сделать след шаг */
    canMakeStep() {
       const nextHeadPoint = this.snake.getNextStepHeadPoint(); 

       return !this.snake.isOnPoint(nextHeadPoint) && // не находится ли след точка на теле змейки
       nextHeadPoint.x < this.config.getColsCount() && //точка находится внутри поля по х
       nextHeadPoint.y < this.config.getRowsCount() && //точка находится внутри поля по у
       nextHeadPoint.x >= 0 && //точка находится внутри поля по х
       nextHeadPoint.y >= 0; //точка находится внутри поля по у
    },
    
    canSetDirection(direction) {
        const lastStepDirection = this.snake.getLastStepDirection();
        return direction === 'up' && lastStepDirection !== 'down' ||
        direction === 'right' && lastStepDirection !== 'left' ||
        direction === 'down' && lastStepDirection !=='up' ||
        direction === 'left' && lastStepDirection !== 'right' 
    },

};

/**запуск игры */
game.init({speed: 6, winFoodCount: 5});//меняем скорость на 8